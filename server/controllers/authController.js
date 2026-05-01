const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'secret';

const getDealerProfile = async (dealerId) => {
    if (!dealerId) {
        return null;
    }

    const result = await pool.query(
        `
        SELECT
            id,
            dealer_name,
            theme_key,
            dealer_logo_url,
            dealer_address,
            mobile_country_code,
            mobile_number,
            contact_email,
            currency_code,
            application_slug
        FROM dealers
        WHERE id = $1
        `,
        [dealerId]
    );

    return result.rows[0] || null;
};

const normalizeFeatureList = (features = []) =>
    Array.from(
        new Map(
            (features || [])
                .filter((feature) => feature?.key)
                .map((feature) => [feature.key, feature])
        ).values()
    );

const buildSessionUser = ({
    realUser,
    effectiveUser,
    profileMode = 'DEFAULT',
    switchedProfile = false,
    effectiveDealerId = null,
}) => ({
    ...effectiveUser,
    features: normalizeFeatureList(effectiveUser?.features || []),
    real_user_id: realUser?.id || effectiveUser?.id || null,
    real_role_id: realUser?.role_id || effectiveUser?.role_id || null,
    real_role_name: realUser?.role_name || effectiveUser?.role_name || null,
    real_dealer_id: realUser?.dealer_id || null,
    real_feature_keys: normalizeFeatureList(realUser?.features || []).map((feature) => feature.key),
    base_dealer_id: effectiveUser?.dealer_id || null,
    effective_dealer_id: effectiveDealerId || effectiveUser?.dealer_id || null,
    profile_mode: profileMode,
    switched_profile: switchedProfile,
});

const applyEffectiveDealerContext = async (user, effectiveDealerId = null) => {
    const normalizedEffectiveDealerId = effectiveDealerId || null;
    const isSuperAdmin = Number(user?.role_id) === 1 || user?.role_name === 'SUPER_ADMIN';

    if (!isSuperAdmin || !normalizedEffectiveDealerId) {
        return {
            ...user,
            base_dealer_id: user?.dealer_id || null,
            effective_dealer_id: user?.dealer_id || null,
            profile_mode: isSuperAdmin ? 'SUPER_ADMIN' : 'DEFAULT',
            switched_profile: false,
        };
    }

    const dealer = await getDealerProfile(normalizedEffectiveDealerId);
    if (!dealer) {
        throw new Error('Selected dealer profile was not found.');
    }

    return {
        ...user,
        base_dealer_id: user?.dealer_id || null,
        dealer_id: dealer.id,
        dealer_name: dealer.dealer_name,
        theme_key: dealer.theme_key,
        dealer_logo_url: dealer.dealer_logo_url,
        dealer_address: dealer.dealer_address,
        mobile_country_code: dealer.mobile_country_code,
        mobile_number: dealer.mobile_number,
        contact_email: dealer.contact_email,
        currency_code: dealer.currency_code,
        application_slug: dealer.application_slug,
        effective_dealer_id: dealer.id,
        effective_dealer_name: dealer.dealer_name,
        profile_mode: 'DEALER_SWITCH',
        switched_profile: true,
    };
};

const buildSessionToken = (user) => jwt.sign(
    {
        id: user.id,
        role_id: user.role_id,
        role_name: user.role_name,
        dealer_id: user.dealer_id || null,
        base_dealer_id: user.base_dealer_id || user.dealer_id || null,
        effective_dealer_id: user.effective_dealer_id || user.dealer_id || null,
        employee_id: user.employee_id || null,
        real_user_id: user.real_user_id || user.id,
        real_role_id: user.real_role_id || user.role_id,
        real_role_name: user.real_role_name || user.role_name,
        real_dealer_id: user.real_dealer_id || null,
        real_feature_keys: user.real_feature_keys || (user.features || []).map((feature) => feature.key),
        profile_mode: user.profile_mode || 'DEFAULT',
        switched_profile: Boolean(user.switched_profile),
        feature_keys: (user.features || []).map((feature) => feature.key),
    },
    getJwtSecret(),
    { expiresIn: '1h' }
);

const mapAccessProfileRow = (user) => {
    const deniedFeatureIds = new Set((user.denied_features || []).map((feature) => feature?.id).filter(Boolean));
    const featureMap = new Map();

    [...(user.role_features || []), ...(user.employee_features || [])].forEach((feature) => {
        if (feature?.id) {
            if (deniedFeatureIds.has(feature.id)) {
                return;
            }
            featureMap.set(feature.id, feature);
        }
    });

    user.features = Array.from(featureMap.values());
    user.denied_features = user.denied_features || [];
    delete user.role_features;
    delete user.employee_features;

    return user;
};

const getUserAccessProfile = async (identifierField, identifierValue) => {
    const result = await pool.query(
        `
        SELECT
            u.id,
            u.full_name,
            u.email,
            u.role_id,
            COALESCE(u.dealer_id, e.dealer_id) AS dealer_id,
            u.is_active,
            u.password_hash,
            u.brand_name,
            u.brand_logo_url,
            u.brand_address,
            r.role_name,
            d.dealer_name,
            d.dealer_code,
            d.theme_key,
            d.dealer_logo_url,
            d.dealer_address,
            d.mobile_country_code,
            d.mobile_number,
            d.contact_email,
            d.currency_code,
            d.application_slug,
            e.id AS employee_id,
            e.employee_code,
            e.department,
            e.job_title,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', rf.id,
                        'key', rf.feature_key,
                        'name', rf.display_name,
                        'source', 'role'
                    )
                ) FILTER (WHERE rf.id IS NOT NULL),
                '[]'::json
            ) AS role_features,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', ef.id,
                        'key', ef.feature_key,
                        'name', ef.display_name,
                        'source', 'employee'
                    )
                ) FILTER (WHERE ef.id IS NOT NULL),
                '[]'::json
            ) AS employee_features
            ,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', df.id,
                        'key', df.feature_key,
                        'name', df.display_name,
                        'source', 'employee_deny'
                    )
                ) FILTER (WHERE df.id IS NOT NULL),
                '[]'::json
            ) AS denied_features
        FROM users u
        LEFT JOIN roles r ON r.id = u.role_id
        LEFT JOIN employees e ON e.user_id = u.id
        LEFT JOIN dealers d ON d.id = COALESCE(u.dealer_id, e.dealer_id)
        LEFT JOIN role_permissions rp ON rp.role_id = u.role_id
        LEFT JOIN features rf ON rf.id = rp.feature_id
        LEFT JOIN employee_features efm ON efm.employee_id = e.id
        LEFT JOIN features ef ON ef.id = efm.feature_id
        LEFT JOIN employee_feature_overrides efo ON efo.employee_id = e.id AND efo.access_mode = 'DENY'
        LEFT JOIN features df ON df.id = efo.feature_id
        WHERE u.${identifierField} = $1
        GROUP BY
            u.id, u.full_name, u.email, u.role_id, u.dealer_id, e.dealer_id, u.is_active, u.password_hash,
            u.brand_name, u.brand_logo_url, u.brand_address,
            r.role_name, d.dealer_name, d.dealer_code, d.theme_key, d.dealer_logo_url, d.dealer_address, d.mobile_country_code, d.mobile_number, d.contact_email, d.currency_code, d.application_slug,
            e.id, e.employee_code, e.department, e.job_title
        `,
        [identifierValue]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return mapAccessProfileRow(result.rows[0]);
};

const getUserAccessProfileForMobileLogin = async (identifierValue, dealerIdentifier = '') => {
    const normalizedDealerIdentifier = String(dealerIdentifier || '').trim();
    const params = [String(identifierValue || '').trim()];
    const dealerClause = normalizedDealerIdentifier
        ? `AND (
            LOWER(COALESCE(d.dealer_code, '')) = LOWER($2)
            OR LOWER(COALESCE(d.application_slug, '')) = LOWER($2)
            OR CAST(d.id AS TEXT) = $2
        )`
        : '';

    if (normalizedDealerIdentifier) {
        params.push(normalizedDealerIdentifier);
    }

    const result = await pool.query(
        `
        SELECT
            u.id,
            u.full_name,
            u.email,
            u.role_id,
            COALESCE(u.dealer_id, e.dealer_id) AS dealer_id,
            u.is_active,
            u.password_hash,
            u.brand_name,
            u.brand_logo_url,
            u.brand_address,
            r.role_name,
            d.dealer_name,
            d.dealer_code,
            d.theme_key,
            d.dealer_logo_url,
            d.dealer_address,
            d.mobile_country_code,
            d.mobile_number,
            d.contact_email,
            d.currency_code,
            d.application_slug,
            e.id AS employee_id,
            e.employee_code,
            e.department,
            e.job_title,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', rf.id,
                        'key', rf.feature_key,
                        'name', rf.display_name,
                        'source', 'role'
                    )
                ) FILTER (WHERE rf.id IS NOT NULL),
                '[]'::json
            ) AS role_features,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', ef.id,
                        'key', ef.feature_key,
                        'name', ef.display_name,
                        'source', 'employee'
                    )
                ) FILTER (WHERE ef.id IS NOT NULL),
                '[]'::json
            ) AS employee_features,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', df.id,
                        'key', df.feature_key,
                        'name', df.display_name,
                        'source', 'employee_deny'
                    )
                ) FILTER (WHERE df.id IS NOT NULL),
                '[]'::json
            ) AS denied_features
        FROM users u
        LEFT JOIN roles r ON r.id = u.role_id
        LEFT JOIN employees e ON e.user_id = u.id
        LEFT JOIN dealers d ON d.id = COALESCE(u.dealer_id, e.dealer_id)
        LEFT JOIN role_permissions rp ON rp.role_id = u.role_id
        LEFT JOIN features rf ON rf.id = rp.feature_id
        LEFT JOIN employee_features efm ON efm.employee_id = e.id
        LEFT JOIN features ef ON ef.id = efm.feature_id
        LEFT JOIN employee_feature_overrides efo ON efo.employee_id = e.id AND efo.access_mode = 'DENY'
        LEFT JOIN features df ON df.id = efo.feature_id
        WHERE (
            LOWER(COALESCE(u.email, '')) = LOWER($1)
            OR UPPER(COALESCE(e.employee_code, '')) = UPPER($1)
        )
        ${dealerClause}
        GROUP BY
            u.id, u.full_name, u.email, u.role_id, u.dealer_id, e.dealer_id, u.is_active, u.password_hash,
            u.brand_name, u.brand_logo_url, u.brand_address,
            r.role_name, d.dealer_name, d.dealer_code, d.theme_key, d.dealer_logo_url, d.dealer_address, d.mobile_country_code, d.mobile_number, d.contact_email, d.currency_code, d.application_slug,
            e.id, e.employee_code, e.department, e.job_title
        LIMIT 1
        `,
        params
    );

    if (result.rows.length === 0) {
        return null;
    }

    return mapAccessProfileRow(result.rows[0]);
};

const getDealerAdminAccessProfile = async (dealerId) => {
    const dealerResult = await pool.query(
        `
        SELECT id, dealer_name, admin_user_id
        FROM dealers
        WHERE id = $1
        `,
        [dealerId]
    );

    if (!dealerResult.rows[0]) {
        throw new Error('Selected dealer profile was not found.');
    }

    if (!dealerResult.rows[0].admin_user_id) {
        throw new Error('Selected dealer does not have an assigned admin profile.');
    }

    const dealerAdmin = await getUserAccessProfile('id', dealerResult.rows[0].admin_user_id);
    if (!dealerAdmin) {
        throw new Error('Selected dealer admin profile was not found.');
    }

    return dealerAdmin;
};

exports.register = async (req, res) => {
    try {
        const { full_name, email, password, role_id, dealer_id } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Prevent creating dealer-scoped staff without dealer binding.
        const requestedRoleId = role_id ? Number(role_id) : 3;
        const roleResult = await pool.query(
            'SELECT id, role_name FROM roles WHERE id = $1 LIMIT 1',
            [requestedRoleId]
        );
        const roleName = roleResult.rows[0]?.role_name || 'AGENT';

        if (roleName !== 'SUPER_ADMIN') {
            const normalizedDealerId = String(dealer_id || '').trim();
            if (!normalizedDealerId) {
                return res.status(400).json({ message: 'Dealer assignment is required for staff accounts.' });
            }
            const dealerCheck = await pool.query('SELECT id FROM dealers WHERE id = $1 LIMIT 1', [normalizedDealerId]);
            if (dealerCheck.rows.length === 0) {
                return res.status(400).json({ message: 'Selected dealer profile was not found.' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Updated to use "password_hash" based on your database error logs
        const newUser = await pool.query(
            'INSERT INTO users (full_name, email, password_hash, role_id, dealer_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role_id, dealer_id',
            [full_name, email, hashedPassword, requestedRoleId, roleName === 'SUPER_ADMIN' ? null : String(dealer_id).trim()]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error("DATABASE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, identifier, dealer_id } = req.body;
        const normalizedIdentifier = String(identifier || email || '').trim();
        const normalizedDealerId = String(dealer_id || '').trim();
        const user = await getUserAccessProfileForMobileLogin(normalizedIdentifier, normalizedDealerId);
        
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.is_active === false) return res.status(403).json({ message: "User is inactive" });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const sessionUser = buildSessionUser({
            realUser: user,
            effectiveUser: await applyEffectiveDealerContext(user, null),
            profileMode: Number(user?.role_id) === 1 || user?.role_name === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'DEFAULT',
            switchedProfile: false,
            effectiveDealerId: user?.dealer_id || null,
        });
        const token = buildSessionToken(sessionUser);

        const safeUser = { ...sessionUser };
        delete safeUser.password_hash;

        res.status(200).json({ token, user: safeUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const realUser = await getUserAccessProfile('id', req.user.real_user_id || req.user.id);
        const effectiveUser = await getUserAccessProfile('id', req.user.id);
        if (!realUser || !effectiveUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sessionUser = buildSessionUser({
            realUser,
            effectiveUser: await applyEffectiveDealerContext(effectiveUser, req.user.effective_dealer_id || null),
            profileMode: req.user.profile_mode || ((Number(realUser?.role_id) === 1 || realUser?.role_name === 'SUPER_ADMIN') ? 'SUPER_ADMIN' : 'DEFAULT'),
            switchedProfile: Boolean(req.user.switched_profile),
            effectiveDealerId: req.user.effective_dealer_id || effectiveUser?.dealer_id || null,
        });
        delete sessionUser.password_hash;
        res.status(200).json(sessionUser);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load profile', error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            brand_name,
            brand_logo_url,
            brand_address,
        } = req.body;

        if (!full_name || !email) {
            return res.status(400).json({ message: 'Full name and email are required' });
        }

        const existingUser = await pool.query(
            'SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND id <> $2',
            [String(email).trim().toLowerCase(), req.user.id]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const params = [
            String(full_name).trim(),
            String(email).trim().toLowerCase(),
            brand_name ? String(brand_name).trim() : null,
            brand_logo_url || null,
            brand_address ? String(brand_address).trim() : null,
            req.user.id,
        ];

        let query = `
            UPDATE users
            SET
                full_name = $1,
                email = $2,
                brand_name = $3,
                brand_logo_url = $4,
                brand_address = $5
        `;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            params.splice(5, 0, hashedPassword);
            query += `,
                password_hash = $6
                WHERE id = $7
            `;
        } else {
            query += `
                WHERE id = $6
            `;
        }

        await pool.query(query, params);

        const realUser = await getUserAccessProfile('id', req.user.real_user_id || req.user.id);
        const updatedUser = await getUserAccessProfile('id', req.user.id);
        const sessionUser = buildSessionUser({
            realUser: realUser || updatedUser,
            effectiveUser: await applyEffectiveDealerContext(updatedUser, req.user.effective_dealer_id || null),
            profileMode: req.user.profile_mode || 'DEFAULT',
            switchedProfile: Boolean(req.user.switched_profile),
            effectiveDealerId: req.user.effective_dealer_id || updatedUser?.dealer_id || null,
        });
        delete sessionUser.password_hash;

        res.status(200).json({
            ...sessionUser,
            password_updated: Boolean(password),
        });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Failed to update profile', error: err.message });
    }
};

exports.uploadProfileLogo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Logo file is required' });
    }

    res.status(200).json({
        url: `/uploads/profile/${req.file.filename}`,
        originalName: req.file.originalname,
    });
};

exports.switchProfile = async (req, res) => {
    try {
        const isSuperAdmin = Number(req.user?.real_role_id || req.user?.role_id) === 1 || (req.user?.real_role_name || req.user?.role_name) === 'SUPER_ADMIN';
        if (!isSuperAdmin) {
            return res.status(403).json({ message: 'Only the super admin can switch profiles.' });
        }

        const requestedDealerId = req.body?.dealer_id || null;
        const baseUser = await getUserAccessProfile('id', req.user.real_user_id || req.user.id);

        if (!baseUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        let sessionUser;
        if (!requestedDealerId) {
            sessionUser = buildSessionUser({
                realUser: baseUser,
                effectiveUser: await applyEffectiveDealerContext(baseUser, null),
                profileMode: 'SUPER_ADMIN',
                switchedProfile: false,
                effectiveDealerId: baseUser?.dealer_id || null,
            });
        } else {
            const targetUser = await getDealerAdminAccessProfile(requestedDealerId);
            sessionUser = buildSessionUser({
                realUser: baseUser,
                effectiveUser: targetUser,
                profileMode: 'DEALER_SWITCH',
                switchedProfile: true,
                effectiveDealerId: requestedDealerId,
            });
        }
        const token = buildSessionToken(sessionUser);
        const safeUser = { ...sessionUser };
        delete safeUser.password_hash;

        res.status(200).json({
            token,
            user: safeUser,
        });
    } catch (err) {
        console.error('Profile switch error:', err);
        res.status(500).json({ message: 'Failed to switch profile', error: err.message });
    }
};

exports.getUserAccessProfile = getUserAccessProfile;
