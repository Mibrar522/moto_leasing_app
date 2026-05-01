const pool = require('../config/db');

const resolveEffectiveDealerId = (user = {}) => user.effective_dealer_id || user.dealer_id || null;

const isSuperAdmin = (user = {}) =>
    Number(user.role_id) === 1 || user.role_name === 'SUPER_ADMIN' || user.real_role_name === 'SUPER_ADMIN';

const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || '').trim());
const httpError = (status, message) => {
    const err = new Error(message);
    err.statusCode = status;
    return err;
};

const resolveDealerIdInput = async (dealerInput) => {
    const raw = String(dealerInput || '').trim();
    if (!raw) return null;
    if (isUuid(raw)) return raw;

    // Allow super admins to paste dealer code or application slug from the UI.
    const lookup = await pool.query(
        `
        SELECT id
        FROM dealers
        WHERE dealer_code = $1
           OR application_slug = $1
        LIMIT 1
        `,
        [raw]
    );

    if (lookup.rows.length === 0) {
        throw httpError(400, 'Dealer ID is invalid. Use dealer UUID, dealer code, or leave it empty for global.');
    }

    return lookup.rows[0].id;
};

exports.listAds = async (req, res) => {
    try {
        const effectiveDealerId = resolveEffectiveDealerId(req.user);
        const adminScope = isSuperAdmin(req.user);
        const params = [];
        const dealerClause = adminScope
            ? ''
            : 'WHERE (dealer_id = $1 OR dealer_id IS NULL)';
        if (!adminScope) params.push(effectiveDealerId);

        const adsResult = await pool.query(
            `
            SELECT
                id,
                dealer_id,
                title,
                subtitle,
                image_url,
                cta_label,
                cta_url,
                display_order,
                is_active,
                start_at,
                end_at,
                created_at,
                updated_at
            FROM app_ads
            ${dealerClause}
            ORDER BY display_order ASC, created_at DESC
            `,
            params
        );

        res.status(200).json({ ads: adsResult.rows });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load ads', error: error.message });
    }
};

exports.createAd = async (req, res) => {
    try {
        const adminScope = isSuperAdmin(req.user);
        const effectiveDealerId = resolveEffectiveDealerId(req.user);
        const {
            title,
            subtitle,
            image_url,
            cta_label,
            cta_url,
            display_order,
            is_active,
            start_at,
            end_at,
            dealer_id,
        } = req.body;

        if (!String(title || '').trim()) {
            throw httpError(400, 'Ad title is required.');
        }

        if (!String(image_url || '').trim()) {
            throw httpError(400, 'Ad image is required. Upload an image first.');
        }

        const resolvedDealerId = adminScope
            ? await resolveDealerIdInput(dealer_id)
            : effectiveDealerId;

        const result = await pool.query(
            `
            INSERT INTO app_ads (
                dealer_id,
                title,
                subtitle,
                image_url,
                cta_label,
                cta_url,
                display_order,
                is_active,
                start_at,
                end_at,
                created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
            `,
            [
                resolvedDealerId,
                title || null,
                subtitle || null,
                image_url || null,
                cta_label || null,
                cta_url || null,
                Number(display_order || 0),
                Boolean(is_active),
                start_at || null,
                end_at || null,
                req.user.id,
            ]
        );

        res.status(201).json({ message: 'Ad created', ad: result.rows[0] });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Failed to create ad', error: error.message });
    }
};

exports.updateAd = async (req, res) => {
    try {
        const adminScope = isSuperAdmin(req.user);
        const effectiveDealerId = resolveEffectiveDealerId(req.user);
        const { id } = req.params;
        const {
            title,
            subtitle,
            image_url,
            cta_label,
            cta_url,
            display_order,
            is_active,
            start_at,
            end_at,
            dealer_id,
        } = req.body;

        const allowedDealerClause = adminScope ? '' : 'AND (dealer_id = $2 OR dealer_id IS NULL)';
        const params = [
            id,
        ];

        if (!adminScope) {
            params.push(effectiveDealerId);
        }

        const existing = await pool.query(
            `
            SELECT id, dealer_id
            FROM app_ads
            WHERE id = $1
            ${allowedDealerClause}
            `,
            params
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        const resolvedDealerId = adminScope
            ? (dealer_id == null || String(dealer_id).trim() === ''
                ? existing.rows[0].dealer_id
                : await resolveDealerIdInput(dealer_id))
            : existing.rows[0].dealer_id;

        const updateResult = await pool.query(
            `
            UPDATE app_ads
            SET
                dealer_id = $2,
                title = $3,
                subtitle = $4,
                image_url = $5,
                cta_label = $6,
                cta_url = $7,
                display_order = $8,
                is_active = $9,
                start_at = $10,
                end_at = $11,
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
            `,
            [
                id,
                resolvedDealerId,
                title || null,
                subtitle || null,
                image_url || null,
                cta_label || null,
                cta_url || null,
                Number(display_order || 0),
                Boolean(is_active),
                start_at || null,
                end_at || null,
            ]
        );

        res.status(200).json({ message: 'Ad updated', ad: updateResult.rows[0] });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Failed to update ad', error: error.message });
    }
};

exports.deleteAd = async (req, res) => {
    try {
        const adminScope = isSuperAdmin(req.user);
        const effectiveDealerId = resolveEffectiveDealerId(req.user);
        const { id } = req.params;
        const params = adminScope ? [id] : [id, effectiveDealerId];
        const dealerClause = adminScope ? '' : 'AND (dealer_id = $2 OR dealer_id IS NULL)';

        const result = await pool.query(
            `
            DELETE FROM app_ads
            WHERE id = $1
            ${dealerClause}
            RETURNING id
            `,
            params
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.status(200).json({ message: 'Ad deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete ad', error: error.message });
    }
};

exports.uploadAdImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        res.status(200).json({
            url: `/uploads/ads/${req.file.filename}`,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload ad image', error: error.message });
    }
};
