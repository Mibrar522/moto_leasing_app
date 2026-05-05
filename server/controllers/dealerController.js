const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { resolveDurableUploadUrl } = require('../utils/storage');
const {
    createDatabaseBackup,
    isDealerTemplateBackupEnabled,
    resolveBackupDirectory,
} = require('../utils/databaseBackup');

const buildSlug = (value) =>
    String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);

const ALLOWED_THEME_KEYS = ['sandstone', 'crimson-navy', 'emerald-ledger'];

const normalizeThemeKey = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    return ALLOWED_THEME_KEYS.includes(normalized) ? normalized : 'sandstone';
};

const dealerSelect = `
    SELECT
        d.id,
        d.dealer_code,
        d.dealer_name,
        d.theme_key,
        d.dealer_logo_url,
        d.dealer_signature_url,
        d.dealer_address,
        d.dealer_cnic,
        d.mobile_country,
        d.mobile_country_code,
        d.mobile_number,
        d.currency_code,
        d.contact_email,
        d.notes,
        d.application_slug,
        d.db_clone_name,
        d.db_backup_label,
        d.provisioning_status,
        d.app_status,
        d.is_active,
        d.admin_user_id,
        d.created_at,
        d.updated_at,
        u.full_name AS created_by_name,
        admin_user.full_name AS admin_full_name,
        admin_user.email AS admin_email,
        admin_user.role_id AS admin_role_id,
        admin_role.role_name AS admin_role_name
    FROM dealers d
    LEFT JOIN users u ON u.id = d.created_by
    LEFT JOIN users admin_user ON admin_user.id = d.admin_user_id
    LEFT JOIN roles admin_role ON admin_role.id = admin_user.role_id
`;

const getDealerProfileById = async (clientOrPool, dealerId) => {
    const result = await clientOrPool.query(
        `
        ${dealerSelect}
        WHERE d.id = $1
        LIMIT 1
        `,
        [dealerId]
    );

    return result.rows[0] || null;
};

exports.listDealers = async (_req, res) => {
    try {
        const result = await pool.query(
            `
            ${dealerSelect}
            ORDER BY d.created_at DESC, d.dealer_name ASC
            `
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load dealers', error: error.message });
    }
};

exports.createDealer = async (req, res) => {
    try {
        const {
            dealer_name,
            theme_key,
            dealer_logo_url,
            dealer_signature_url,
            dealer_address,
            dealer_cnic,
            mobile_country,
            mobile_country_code,
            mobile_number,
            currency_code,
            contact_email,
            notes,
            is_active,
            admin_full_name,
            admin_email,
            admin_password,
            admin_role_id,
            backup_directory,
        } = req.body;

        if (!dealer_name || !dealer_signature_url || !dealer_address || !dealer_cnic || !mobile_number || !currency_code || !admin_full_name || !admin_email || !admin_password) {
            return res.status(400).json({
                message: 'Dealer profile, signature image, and dealer admin credentials are required',
            });
        }

        const client = await pool.connect();
        let transactionCommitted = false;

        try {
            await client.query('BEGIN');

            const dealerCodeResult = await client.query(
            `
            SELECT CONCAT(
                'DLR-',
                LPAD(
                    (
                        COALESCE(
                            MAX(NULLIF(regexp_replace(dealer_code, '[^0-9]', '', 'g'), '')::int),
                            0
                        ) + 1
                    )::text,
                    4,
                    '0'
                )
            ) AS dealer_code
            FROM dealers
            `
        );

            const dealerCode = dealerCodeResult.rows[0].dealer_code;
            const baseSlug = buildSlug(dealer_name) || dealerCode.toLowerCase();
            let applicationSlug = baseSlug;
            let slugCounter = 1;

            while (true) {
                const slugCheck = await client.query(
                    'SELECT 1 FROM dealers WHERE application_slug = $1',
                    [applicationSlug]
                );

                if (slugCheck.rows.length === 0) {
                    break;
                }

                slugCounter += 1;
                applicationSlug = `${baseSlug}-${slugCounter}`;
            }

            const roleResult = await client.query(
                `
                SELECT id, role_name
                FROM roles
                WHERE id = COALESCE($1, (SELECT id FROM roles WHERE role_name = 'APPLICATION_ADMIN' LIMIT 1))
                LIMIT 1
                `,
                [admin_role_id || null]
            );

            if (roleResult.rows.length === 0) {
                throw new Error('Selected dealer admin role is invalid');
            }

            if (roleResult.rows[0].role_name === 'SUPER_ADMIN') {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Dealer admin role cannot be SUPER_ADMIN.' });
            }

            const existingAdmin = await client.query(
                'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
                [admin_email]
            );

            if (existingAdmin.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(409).json({ message: 'Dealer admin email already exists' });
            }

            const cloneName = `${applicationSlug.replace(/-/g, '_')}_app`;
            const backupLabel = `${applicationSlug}_backup_seed`;
            const resolvedBackupDirectory = resolveBackupDirectory(backup_directory);
            const result = await client.query(
            `
            INSERT INTO dealers (
                dealer_code,
                dealer_name,
                application_slug,
                theme_key,
                dealer_logo_url,
                dealer_signature_url,
                dealer_address,
                dealer_cnic,
                mobile_country,
                mobile_country_code,
                mobile_number,
                currency_code,
                contact_email,
                notes,
                db_clone_name,
                db_backup_label,
                is_active,
                created_by
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
            RETURNING *
            `,
            [
                dealerCode,
                String(dealer_name).trim(),
                applicationSlug,
                normalizeThemeKey(theme_key),
                dealer_logo_url || null,
                dealer_signature_url || null,
                String(dealer_address).trim(),
                String(dealer_cnic).trim(),
                String(mobile_country || 'QATAR').trim().toUpperCase(),
                String(mobile_country_code || '+974').trim(),
                String(mobile_number).trim(),
                String(currency_code).trim().toUpperCase(),
                contact_email ? String(contact_email).trim().toLowerCase() : null,
                notes || null,
                cloneName,
                backupLabel,
                is_active !== false,
                req.user.id,
            ]
        );

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(admin_password, salt);
            const adminUserResult = await client.query(
                `
                INSERT INTO users (full_name, email, password_hash, role_id, is_active, dealer_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, full_name, email
                `,
                [
                    String(admin_full_name).trim(),
                    String(admin_email).trim().toLowerCase(),
                    hashedPassword,
                    roleResult.rows[0].id,
                    is_active !== false,
                    result.rows[0].id,
                ]
            );

            const updatedDealer = await client.query(
                `
                UPDATE dealers
                SET admin_user_id = $1
                WHERE id = $2
                RETURNING *
                `,
                [adminUserResult.rows[0].id, result.rows[0].id]
            );

            await client.query('COMMIT');
            transactionCommitted = true;

            let backup = null;

            if (isDealerTemplateBackupEnabled(backup_directory)) {
                try {
                    backup = await createDatabaseBackup({
                        applicationSlug,
                        backupLabel,
                        dealerCode,
                        backupDirectory: resolvedBackupDirectory,
                    });
                } catch (backupError) {
                    backup = {
                        status: 'FAILED',
                        directory: resolvedBackupDirectory,
                        error: backupError.message,
                    };
                }
            }

            res.status(201).json({
                ...updatedDealer.rows[0],
                dealer_admin: adminUserResult.rows[0],
                backup,
                fresh_start_summary: {
                    customers: 0,
                    employees: 0,
                    products: 0,
                    sales: 0,
                },
                clone_profile: {
                    application_slug: applicationSlug,
                    db_clone_name: cloneName,
                    db_backup_label: backupLabel,
                    backup_directory: resolvedBackupDirectory,
                    provisioning_status: updatedDealer.rows[0].provisioning_status,
                },
                message:
                    backup?.status === 'COMPLETED'
                        ? 'Dealer created and empty template backup completed'
                        : backup?.status === 'FAILED'
                            ? 'Dealer created, but empty template backup failed'
                            : 'Dealer created successfully',
            });
        } catch (error) {
            if (!transactionCommitted) {
                await client.query('ROLLBACK');
            }
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Dealer creation error:', error);
        res.status(500).json({ message: 'Failed to create dealer', error: error.message });
    }
};

exports.updateDealer = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            dealer_name,
            theme_key,
            dealer_logo_url,
            dealer_signature_url,
            dealer_address,
            dealer_cnic,
            mobile_country,
            mobile_country_code,
            mobile_number,
            currency_code,
            contact_email,
            notes,
            is_active,
            admin_full_name,
            admin_email,
            admin_password,
            admin_role_id,
            backup_directory,
        } = req.body;

        if (!dealer_name || !dealer_signature_url || !dealer_address || !dealer_cnic || !mobile_number || !admin_full_name || !admin_email) {
            return res.status(400).json({
                message: 'Dealer profile fields, signature image, and dealer admin identity are required',
            });
        }

        await client.query('BEGIN');

        const existingDealer = await client.query(
            'SELECT id, admin_user_id, dealer_code, application_slug, db_backup_label FROM dealers WHERE id = $1',
            [req.params.id]
        );

        if (existingDealer.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Dealer not found' });
        }

        const conflictingAdmin = await client.query(
            'SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND id <> $2',
            [admin_email, existingDealer.rows[0].admin_user_id || null]
        );

        if (conflictingAdmin.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'Dealer admin email already exists' });
        }

        const roleResult = await client.query(
            `
            SELECT id, role_name
            FROM roles
            WHERE id = COALESCE($1, (SELECT role_id FROM users WHERE id = $2), (SELECT id FROM roles WHERE role_name = 'APPLICATION_ADMIN' LIMIT 1))
            LIMIT 1
            `,
            [admin_role_id || null, existingDealer.rows[0].admin_user_id || null]
        );

        if (roleResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Selected dealer admin role is invalid.' });
        }

        if (roleResult.rows[0].role_name === 'SUPER_ADMIN') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Dealer admin role cannot be SUPER_ADMIN.' });
        }

        await client.query(
            `
            UPDATE dealers
            SET
                dealer_name = $1,
                theme_key = $2,
                dealer_logo_url = $3,
                dealer_signature_url = $4,
                dealer_address = $5,
                dealer_cnic = $6,
                mobile_country = $7,
                mobile_country_code = $8,
                mobile_number = $9,
                currency_code = $10,
                contact_email = $11,
                notes = $12,
                is_active = $13,
                updated_at = NOW()
            WHERE id = $14
            `,
            [
                String(dealer_name).trim(),
                normalizeThemeKey(theme_key),
                dealer_logo_url || null,
                dealer_signature_url || null,
                String(dealer_address).trim(),
                String(dealer_cnic).trim(),
                String(mobile_country || 'QATAR').trim().toUpperCase(),
                String(mobile_country_code || '+974').trim(),
                String(mobile_number).trim(),
                String(currency_code || 'QAR').trim().toUpperCase(),
                contact_email ? String(contact_email).trim().toLowerCase() : null,
                notes || null,
                is_active !== false,
                req.params.id,
            ]
        );

        if (existingDealer.rows[0].admin_user_id) {
            if (admin_password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(admin_password, salt);

                await client.query(
                    `
                    UPDATE users
                    SET
                        full_name = $1,
                        email = $2,
                        role_id = $3,
                        is_active = $4,
                        password_hash = $5,
                        dealer_id = $6
                    WHERE id = $7
                    `,
                    [
                        String(admin_full_name).trim(),
                        String(admin_email).trim().toLowerCase(),
                        roleResult.rows[0].id,
                        is_active !== false,
                        hashedPassword,
                        req.params.id,
                        existingDealer.rows[0].admin_user_id,
                    ]
                );
            } else {
                await client.query(
                    `
                    UPDATE users
                    SET
                        full_name = $1,
                        email = $2,
                        role_id = $3,
                        is_active = $4,
                        dealer_id = $5
                    WHERE id = $6
                    `,
                    [
                        String(admin_full_name).trim(),
                        String(admin_email).trim().toLowerCase(),
                        roleResult.rows[0].id,
                        is_active !== false,
                        req.params.id,
                        existingDealer.rows[0].admin_user_id,
                    ]
                );
            }
        } else {
            if (!admin_password) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    message: 'Dealer admin password is required because this dealer does not have an admin user yet.',
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(admin_password, salt);
            const adminUserResult = await client.query(
                `
                INSERT INTO users (full_name, email, password_hash, role_id, is_active, dealer_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
                `,
                [
                    String(admin_full_name).trim(),
                    String(admin_email).trim().toLowerCase(),
                    hashedPassword,
                    roleResult.rows[0].id,
                    is_active !== false,
                    req.params.id,
                ]
            );

            await client.query(
                `
                UPDATE dealers
                SET admin_user_id = $1
                WHERE id = $2
                `,
                [adminUserResult.rows[0].id, req.params.id]
            );
        }

        const result = await client.query(
            `
            ${dealerSelect}
            WHERE d.id = $1
            `,
            [req.params.id]
        );

        await client.query('COMMIT');
        const resolvedBackupDirectory = resolveBackupDirectory(backup_directory);
        let backup = null;

        if (isDealerTemplateBackupEnabled(backup_directory)) {
            try {
                backup = await createDatabaseBackup({
                    applicationSlug: result.rows[0].application_slug || existingDealer.rows[0].application_slug,
                    backupLabel: result.rows[0].db_backup_label || existingDealer.rows[0].db_backup_label || `${result.rows[0].application_slug || 'dealer'}_backup_seed`,
                    dealerCode: result.rows[0].dealer_code || existingDealer.rows[0].dealer_code,
                    backupDirectory: resolvedBackupDirectory,
                });
            } catch (backupError) {
                backup = {
                    status: 'FAILED',
                    directory: resolvedBackupDirectory,
                    error: backupError.message,
                };
            }
        }

        res.status(200).json({
            ...result.rows[0],
            dealer_admin: {
                id: result.rows[0].admin_user_id,
                full_name: result.rows[0].admin_full_name,
                email: result.rows[0].admin_email,
            },
            backup,
            clone_profile: {
                application_slug: result.rows[0].application_slug || existingDealer.rows[0].application_slug,
                db_clone_name: result.rows[0].db_clone_name,
                db_backup_label: result.rows[0].db_backup_label || existingDealer.rows[0].db_backup_label,
                backup_directory: resolvedBackupDirectory,
                provisioning_status: result.rows[0].provisioning_status,
            },
            message:
                backup?.status === 'COMPLETED'
                    ? 'Dealer updated and empty template backup completed'
                    : backup?.status === 'FAILED'
                        ? 'Dealer updated, but empty template backup failed'
                        : 'Dealer updated successfully',
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to update dealer', error: error.message });
    } finally {
        client.release();
    }
};

exports.getMyDealerProfile = async (req, res) => {
    try {
        if (!req.user?.dealer_id) {
            return res.status(404).json({ message: 'Dealer profile not found for this user' });
        }

        const dealer = await getDealerProfileById(pool, req.user.dealer_id);
        if (!dealer) {
            return res.status(404).json({ message: 'Dealer profile not found' });
        }

        res.status(200).json(dealer);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load dealer profile', error: error.message });
    }
};

exports.updateMyDealerProfile = async (req, res) => {
    const client = await pool.connect();

    try {
        if (!req.user?.dealer_id) {
            return res.status(404).json({ message: 'Dealer profile not found for this user' });
        }

        const {
            dealer_name,
            theme_key,
            dealer_logo_url,
            dealer_signature_url,
            dealer_address,
            dealer_cnic,
            mobile_country,
            mobile_country_code,
            mobile_number,
            currency_code,
            contact_email,
            notes,
            admin_full_name,
            admin_email,
            admin_password,
        } = req.body;

        if (!dealer_name || !dealer_signature_url || !dealer_address || !dealer_cnic || !mobile_number || !admin_full_name || !admin_email) {
            return res.status(400).json({
                message: 'Dealer profile fields, signature image, and dealer admin identity are required',
            });
        }

        await client.query('BEGIN');

        const existingDealer = await client.query(
            'SELECT id, admin_user_id FROM dealers WHERE id = $1',
            [req.user.dealer_id]
        );

        if (existingDealer.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Dealer not found' });
        }

        const conflictingAdmin = await client.query(
            'SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND id <> $2',
            [admin_email, existingDealer.rows[0].admin_user_id || req.user.id]
        );

        if (conflictingAdmin.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'Dealer admin email already exists' });
        }

        await client.query(
            `
            UPDATE dealers
            SET
                dealer_name = $1,
                theme_key = $2,
                dealer_logo_url = $3,
                dealer_signature_url = $4,
                dealer_address = $5,
                dealer_cnic = $6,
                mobile_country = $7,
                mobile_country_code = $8,
                mobile_number = $9,
                currency_code = $10,
                contact_email = $11,
                notes = $12,
                updated_at = NOW()
            WHERE id = $13
            `,
            [
                String(dealer_name).trim(),
                normalizeThemeKey(theme_key),
                dealer_logo_url || null,
                dealer_signature_url || null,
                String(dealer_address).trim(),
                String(dealer_cnic).trim(),
                String(mobile_country || 'QATAR').trim().toUpperCase(),
                String(mobile_country_code || '+974').trim(),
                String(mobile_number).trim(),
                String(currency_code || 'QAR').trim().toUpperCase(),
                contact_email ? String(contact_email).trim().toLowerCase() : null,
                notes || null,
                req.user.dealer_id,
            ]
        );

        if (existingDealer.rows[0].admin_user_id) {
            if (admin_password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(admin_password, salt);

                await client.query(
                    `
                    UPDATE users
                    SET
                        full_name = $1,
                        email = $2,
                        password_hash = $3
                    WHERE id = $4
                    `,
                    [
                        String(admin_full_name).trim(),
                        String(admin_email).trim().toLowerCase(),
                        hashedPassword,
                        existingDealer.rows[0].admin_user_id,
                    ]
                );
            } else {
                await client.query(
                    `
                    UPDATE users
                    SET
                        full_name = $1,
                        email = $2
                    WHERE id = $3
                    `,
                    [
                        String(admin_full_name).trim(),
                        String(admin_email).trim().toLowerCase(),
                        existingDealer.rows[0].admin_user_id,
                    ]
                );
            }
        }

        const dealer = await getDealerProfileById(client, req.user.dealer_id);

        await client.query('COMMIT');
        res.status(200).json({
            ...dealer,
            profile_updated: true,
            password_updated: Boolean(admin_password),
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Dealer self-profile update error:', error);
        res.status(500).json({ message: 'Failed to update dealer profile', error: error.message });
    } finally {
        client.release();
    }
};

exports.deleteDealer = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const dealerResult = await client.query(
            'SELECT id, dealer_name FROM dealers WHERE id = $1',
            [req.params.id]
        );

        if (dealerResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Dealer not found' });
        }

        await client.query('DELETE FROM employees WHERE dealer_id = $1', [req.params.id]);
        await client.query('DELETE FROM users WHERE dealer_id = $1', [req.params.id]);

        const deletedDealer = await client.query(
            'DELETE FROM dealers WHERE id = $1 RETURNING id, dealer_name, dealer_code',
            [req.params.id]
        );

        await client.query('COMMIT');
        res.status(200).json({
            message: 'Dealer deleted',
            dealer: deletedDealer.rows[0],
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to delete dealer', error: error.message });
    } finally {
        client.release();
    }
};

exports.uploadDealerLogo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Dealer logo is required' });
    }

    const fallbackUrl = `/uploads/dealers/${req.file.filename}`;
    const url = await resolveDurableUploadUrl(req.file, 'dealers/logos', fallbackUrl);

    res.status(201).json({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        url,
    });
};

exports.uploadDealerSignature = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Dealer signature image is required' });
    }

    const fallbackUrl = `/uploads/dealers/${req.file.filename}`;
    const url = await resolveDurableUploadUrl(req.file, 'dealers/signatures', fallbackUrl);

    res.status(201).json({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        url,
    });
};
