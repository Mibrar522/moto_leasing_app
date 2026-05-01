const pool = require('../config/db');

exports.listCompanies = async (_req, res) => {
    try {
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
            ORDER BY company_name ASC, created_at DESC
            `
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load company profiles', error: error.message });
    }
};

exports.createCompany = async (req, res) => {
    try {
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
            INSERT INTO company_profiles (
                company_name, company_email, contact_person, phone, address, notes, is_active
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            ON CONFLICT (company_name)
            DO UPDATE SET
                company_email = EXCLUDED.company_email,
                contact_person = EXCLUDED.contact_person,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                notes = EXCLUDED.notes,
                is_active = EXCLUDED.is_active,
                updated_at = NOW()
            RETURNING *
            `,
            [
                String(company_name || '').trim(),
                String(company_email || '').trim() || null,
                String(contact_person || '').trim() || null,
                String(phone || '').trim() || null,
                String(address || '').trim() || null,
                String(notes || '').trim() || null,
                typeof is_active === 'boolean' ? is_active : true,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save company profile', error: error.message });
    }
};

exports.updateCompany = async (req, res) => {
    try {
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
        const linkedOrders = await pool.query(
            'SELECT COUNT(*)::int AS total FROM stock_orders WHERE company_profile_id = $1',
            [req.params.id]
        );

        if (Number(linkedOrders.rows[0]?.total || 0) > 0) {
            const result = await pool.query(
                `
                UPDATE company_profiles
                SET is_active = FALSE, updated_at = NOW()
                WHERE id = $1
                RETURNING *
                `,
                [req.params.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Company profile not found' });
            }

            return res.status(200).json({ ...result.rows[0], archived: true });
        }

        const result = await pool.query(
            'DELETE FROM company_profiles WHERE id = $1 RETURNING id',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete company profile', error: error.message });
    }
};
