const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const getJwtSecret = () => process.env.JWT_SECRET || 'secret';

const extractBearerToken = (req) => {
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    const value = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (!value) return null;
    const [scheme, token] = String(value).split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
    return token.trim();
};

const protectCustomer = async (req, res, next) => {
    try {
        const token = extractBearerToken(req);
        if (!token) {
            return res.status(401).json({ message: 'Missing authorization token' });
        }

        const decoded = jwt.verify(token, getJwtSecret());
        if (!decoded?.customer_account_id) {
            return res.status(401).json({ message: 'Invalid customer token' });
        }

        const accountResult = await pool.query(
            `
            SELECT
                ca.id,
                ca.customer_id,
                ca.email,
                ca.phone_country_code,
                ca.phone_number,
                ca.phone_e164,
                ca.is_phone_verified,
                ca.is_active,
                ca.preferred_dealer_id,
                c.full_name,
                c.cnic_passport_number,
                c.ocr_details
            FROM customer_accounts ca
            JOIN customers c ON c.id = ca.customer_id
            WHERE ca.id = $1
            LIMIT 1
            `,
            [decoded.customer_account_id]
        );

        if (accountResult.rows.length === 0) {
            return res.status(401).json({ message: 'Customer session not found' });
        }

        const account = accountResult.rows[0];
        if (!account.is_active) {
            return res.status(403).json({ message: 'Account is disabled' });
        }

        req.customer = account;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = { protectCustomer };

