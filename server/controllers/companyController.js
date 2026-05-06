const pool = require('../config/db');

const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';
const getEffectiveDealerId = (user = {}) => user.effective_dealer_id || user.dealer_id || null;
const hasGlobalScope = (user = {}) => isSuperAdminSession(user) && !getEffectiveDealerId(user);

const ensureCompanyDealerColumns = async () => {
    await pool.query(`
        ALTER TABLE company_profiles
            ADD COLUMN IF NOT EXISTS dealer_id UUID REFERENCES dealers(id),
            ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id)
    `);

    await pool.query(`
        UPDATE company_profiles cp
        SET dealer_id = scoped.dealer_id
        FROM (
            SELECT DISTINCT ON (so.company_profile_id)
                so.company_profile_id,
                u.dealer_id
            FROM stock_orders so
            JOIN users u ON u.id = so.ordered_by
            WHERE so.company_profile_id IS NOT NULL
              AND u.dealer_id IS NOT NULL
            ORDER BY so.company_profile_id, so.created_at DESC
        ) scoped
        WHERE cp.id = scoped.company_profile_id
          AND cp.dealer_id IS NULL
    `);
};

exports.listCompanies = async (req, res) => {
    try {
        await ensureCompanyDealerColumns();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);
        const result = await pool.query(
            `
            SELECT
                id,
                company_name,
                company_email,
                contact_person,
                phone,
                address,
                notes,
                is_active,
                created_at,
                updated_at
            FROM company_profiles
            WHERE is_active = TRUE
              ${globalScope ? '' : 'AND dealer_id = $1'}
            ORDER BY company_name ASC, created_at DESC
            `,
            globalScope ? [] : [dealerId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load company profiles', error: error.message });
    }
};

exports.createCompany = async (req, res) => {
    try {
        await ensureCompanyDealerColumns();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);
        if (!globalScope && !dealerId) {
            return res.status(403).json({ message: 'Dealer scope is required to save company profiles.' });
        }

        const {
            company_name,
            company_email,
            contact_person,
            phone,
            address,
            notes,
            is_active,
        } = req.body;

        if (!String(company_name || '').trim()) {
            return res.status(400).json({ message: 'Company name is required' });
        }

        const values = [
            String(company_name || '').trim(),
            String(company_email || '').trim() || null,
            String(contact_person || '').trim() || null,
            String(phone || '').trim() || null,
            String(address || '').trim() || null,
            String(notes || '').trim() || null,
            typeof is_active === 'boolean' ? is_active : true,
            globalScope ? null : dealerId,
            req.user.id,
        ];

        const existingCompany = await pool.query(
            `
            SELECT id
            FROM company_profiles
            WHERE UPPER(TRIM(company_name)) = UPPER(TRIM($1::varchar))
              AND ${globalScope ? 'dealer_id IS NULL' : 'dealer_id = $2'}
            LIMIT 1
            `,
            globalScope ? [values[0]] : [values[0], dealerId]
        );

        const result = existingCompany.rows.length > 0
            ? await pool.query(
                `
                UPDATE company_profiles
                SET
                    company_name = $2,
                    company_email = $3,
                    contact_person = $4,
                    phone = $5,
                    address = $6,
                    notes = $7,
                    is_active = $8,
                    dealer_id = $9,
                    created_by = COALESCE(created_by, $10),
                    updated_at = NOW()
                WHERE id = $1
                RETURNING *
                `,
                [existingCompany.rows[0].id, ...values]
            )
            : await pool.query(
                `
                INSERT INTO company_profiles (
                    company_name, company_email, contact_person, phone, address, notes, is_active, dealer_id, created_by
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                RETURNING *
                `,
                values
            );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to save company profile',
            error: error.message,
            codeVersion: 'company-profile-no-conflict-v1',
        });
    }
};

exports.updateCompany = async (req, res) => {
    try {
        await ensureCompanyDealerColumns();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);

        const {
            company_name,
            company_email,
            contact_person,
            phone,
            address,
            notes,
            is_active,
        } = req.body;

        if (!String(company_name || '').trim()) {
            return res.status(400).json({ message: 'Company name is required' });
        }

        const result = await pool.query(
            `
            UPDATE company_profiles
            SET
                company_name = $2,
                company_email = $3,
                contact_person = $4,
                phone = $5,
                address = $6,
                notes = $7,
                is_active = $8,
                updated_at = NOW()
            WHERE id = $1
              ${globalScope ? '' : 'AND dealer_id = $9'}
            RETURNING *
            `,
            [
                req.params.id,
                String(company_name || '').trim(),
                String(company_email || '').trim() || null,
                String(contact_person || '').trim() || null,
                String(phone || '').trim() || null,
                String(address || '').trim() || null,
                String(notes || '').trim() || null,
                typeof is_active === 'boolean' ? is_active : true,
                ...(globalScope ? [] : [dealerId]),
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update company profile', error: error.message });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        await ensureCompanyDealerColumns();
        const globalScope = hasGlobalScope(req.user);
        const dealerId = getEffectiveDealerId(req.user);

        const linkedOrders = await pool.query(
            `
            SELECT COUNT(*)::int AS total
            FROM stock_orders so
            JOIN users u ON u.id = so.ordered_by
            WHERE so.company_profile_id = $1
              ${globalScope ? '' : 'AND u.dealer_id = $2'}
            `,
            globalScope ? [req.params.id] : [req.params.id, dealerId]
        );

        if (Number(linkedOrders.rows[0]?.total || 0) > 0) {
            const result = await pool.query(
                `
                UPDATE company_profiles
                SET is_active = FALSE, updated_at = NOW()
                WHERE id = $1
                  ${globalScope ? '' : 'AND dealer_id = $2'}
                RETURNING *
                `,
                globalScope ? [req.params.id] : [req.params.id, dealerId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Company profile not found' });
            }

            return res.status(200).json({ ...result.rows[0], archived: true });
        }

        const result = await pool.query(
            `
            DELETE FROM company_profiles
            WHERE id = $1
              ${globalScope ? '' : 'AND dealer_id = $2'}
            RETURNING id
            `,
            globalScope ? [req.params.id] : [req.params.id, dealerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete company profile', error: error.message });
    }
};
