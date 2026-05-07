const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'secret';
const OTP_TTL_MINUTES = Number(process.env.CUSTOMER_OTP_TTL_MINUTES || 5);
const SHOULD_ECHO_OTP = String(process.env.CUSTOMER_OTP_ECHO || '').toLowerCase() === 'true';

const normalizeDigits = (value) => String(value || '').replace(/\D+/g, '');

const formatCnic = (value) => {
    const digits = normalizeDigits(value);
    if (digits.length !== 13) return String(value || '').trim();
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
};

const normalizePhone = (countryCode, phoneNumber) => {
    const code = String(countryCode || '').trim();
    const digits = normalizeDigits(phoneNumber);
    const normalizedCode = code.startsWith('+') ? code : `+${normalizeDigits(code)}`;
    return {
        phone_country_code: normalizedCode,
        phone_number: digits,
        phone_e164: `${normalizedCode}${digits}`,
    };
};

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const issueCustomerToken = (account) => jwt.sign(
    {
        customer_account_id: account.id,
        customer_id: account.customer_id,
        type: 'CUSTOMER',
    },
    getJwtSecret(),
    { expiresIn: process.env.CUSTOMER_JWT_EXPIRES_IN || '30d' }
);

const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const findLatestActiveOtp = async (phoneE164, purpose) => {
    const result = await pool.query(
        `
        SELECT id, code_hash, expires_at, consumed_at
        FROM customer_otps
        WHERE phone_e164 = $1
          AND purpose = $2
          AND consumed_at IS NULL
          AND expires_at > now()
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [phoneE164, purpose]
    );
    return result.rows[0] || null;
};

exports.requestOtp = async (req, res) => {
    try {
        const purpose = String(req.body.purpose || '').trim().toUpperCase();
        if (!['SIGNUP', 'LOGIN'].includes(purpose)) {
            return res.status(400).json({ message: 'purpose must be SIGNUP or LOGIN' });
        }

        const email = normalizeEmail(req.body.email);
        const phone = normalizePhone(req.body.phone_country_code, req.body.phone_number);

        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Valid email is required' });
        }

        if (!phone.phone_number || phone.phone_number.length < 7) {
            return res.status(400).json({ message: 'Valid phone number is required' });
        }

        const existing = await pool.query(
            `
            SELECT id, email, phone_e164, is_active
            FROM customer_accounts
            WHERE lower(email) = lower($1)
               OR phone_e164 = $2
            LIMIT 1
            `,
            [email, phone.phone_e164]
        );

        if (purpose === 'SIGNUP' && existing.rows.length > 0) {
            return res.status(409).json({ message: 'Account already exists with this email or phone number' });
        }

        if (purpose === 'LOGIN' && existing.rows.length === 0) {
            return res.status(404).json({ message: 'Account not found. Please sign up first.' });
        }

        const code = generateOtpCode();
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

        await pool.query(
            `
            INSERT INTO customer_otps (phone_e164, purpose, code_hash, expires_at)
            VALUES ($1, $2, $3, $4)
            `,
            [phone.phone_e164, purpose, codeHash, expiresAt]
        );

        // Placeholder "sender": for now we log it so QA can proceed without SMS provider wiring.
        console.log(`[CUSTOMER_OTP] ${purpose} ${phone.phone_e164} => ${code} (expires ${expiresAt.toISOString()})`);

        const payload = {
            message: 'OTP sent',
            expires_in_seconds: OTP_TTL_MINUTES * 60,
        };

        if (SHOULD_ECHO_OTP && String(process.env.NODE_ENV || '').toLowerCase() !== 'production') {
            payload.dev_code = code;
        }

        return res.status(200).json(payload);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to request OTP', error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const client = await pool.connect();
    try {
        const purpose = String(req.body.purpose || '').trim().toUpperCase();
        if (!['SIGNUP', 'LOGIN'].includes(purpose)) {
            return res.status(400).json({ message: 'purpose must be SIGNUP or LOGIN' });
        }

        const email = normalizeEmail(req.body.email);
        const phone = normalizePhone(req.body.phone_country_code, req.body.phone_number);
        const code = String(req.body.code || '').trim();

        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Valid email is required' });
        }

        if (!phone.phone_number || phone.phone_number.length < 7) {
            return res.status(400).json({ message: 'Valid phone number is required' });
        }

        if (!code || code.length < 4) {
            return res.status(400).json({ message: 'OTP code is required' });
        }

        const otpRow = await findLatestActiveOtp(phone.phone_e164, purpose);
        if (!otpRow) {
            return res.status(400).json({ message: 'OTP expired or not found. Request a new OTP.' });
        }

        const otpOk = await bcrypt.compare(code, otpRow.code_hash);
        if (!otpOk) {
            return res.status(400).json({ message: 'Invalid OTP code' });
        }

        await client.query('BEGIN');
        await client.query('ALTER TABLE customers ADD COLUMN IF NOT EXISTS dealer_id uuid');

        await client.query(
            `
            UPDATE customer_otps
            SET consumed_at = now()
            WHERE id = $1
            `,
            [otpRow.id]
        );

        let accountRow = null;

        if (purpose === 'SIGNUP') {
            const fullName = String(req.body.full_name || '').trim();
            const rawCnic = String(req.body.cnic || '').trim();
            const address = String(req.body.address || '').trim();
            const preferredDealerId = req.body.preferred_dealer_id || null;

            if (!fullName) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Full name is required' });
            }

            if (!rawCnic) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'CNIC is required' });
            }

            const cnic = formatCnic(rawCnic);

            if (!preferredDealerId) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Preferred dealer is required for customer signup' });
            }

            const dealerCheck = await client.query(
                'SELECT id FROM dealers WHERE id = $1 AND is_active = TRUE',
                [preferredDealerId]
            );
            if (dealerCheck.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Selected dealer is invalid or inactive' });
            }

            const existingAccountCheck = await client.query(
                `
                SELECT id
                FROM customer_accounts
                WHERE lower(email) = lower($1)
                   OR phone_e164 = $2
                LIMIT 1
                `,
                [email, phone.phone_e164]
            );

            if (existingAccountCheck.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(409).json({ message: 'Account already exists with this email or phone number' });
            }

            let customerInsert;
            try {
                customerInsert = await client.query(
                    `
                    INSERT INTO customers (full_name, cnic_passport_number, ocr_details, created_by_agent, dealer_id, identity_doc_url, biometric_hash)
                    VALUES ($1, $2, $3, NULL, $4, NULL, NULL)
                    RETURNING id, full_name, cnic_passport_number, ocr_details, dealer_id
                    `,
                    [
                        fullName,
                        cnic,
                        {
                            contact_email: email,
                            contact_phone: phone.phone_e164,
                            address,
                        },
                        preferredDealerId,
                    ]
                );
            } catch (error) {
                if (error?.code === '23505') {
                    await client.query('ROLLBACK');
                    return res.status(409).json({ message: 'A customer already exists with this CNIC / Passport number.' });
                }
                throw error;
            }

            const customer = customerInsert.rows[0];

            const accountInsert = await client.query(
                `
                INSERT INTO customer_accounts (
                    customer_id,
                    email,
                    phone_country_code,
                    phone_number,
                    phone_e164,
                    is_phone_verified,
                    preferred_dealer_id
                )
                VALUES ($1,$2,$3,$4,$5,true,$6)
                RETURNING id, customer_id, email, phone_country_code, phone_number, phone_e164, is_phone_verified, preferred_dealer_id
                `,
                [
                    customer.id,
                    email,
                    phone.phone_country_code,
                    phone.phone_number,
                    phone.phone_e164,
                    preferredDealerId,
                ]
            );

            accountRow = {
                ...accountInsert.rows[0],
                full_name: customer.full_name,
                cnic_passport_number: customer.cnic_passport_number,
                ocr_details: customer.ocr_details,
            };
        } else {
            const accountResult = await client.query(
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
                WHERE lower(ca.email) = lower($1)
                  AND ca.phone_e164 = $2
                LIMIT 1
                `,
                [email, phone.phone_e164]
            );

            if (accountResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Account not found. Please sign up first.' });
            }

            accountRow = accountResult.rows[0];

            if (!accountRow.is_active) {
                await client.query('ROLLBACK');
                return res.status(403).json({ message: 'Account is disabled' });
            }

            if (!accountRow.is_phone_verified) {
                await client.query(
                    `
                    UPDATE customer_accounts
                    SET is_phone_verified = true,
                        updated_at = now()
                    WHERE id = $1
                    `,
                    [accountRow.id]
                );
                accountRow.is_phone_verified = true;
            }
        }

        await client.query('COMMIT');

        const token = issueCustomerToken(accountRow);

        return res.status(200).json({
            message: 'Verified',
            token,
            profile: {
                customer_id: accountRow.customer_id,
                customer_account_id: accountRow.id,
                full_name: accountRow.full_name,
                email: accountRow.email,
                phone_e164: accountRow.phone_e164,
                preferred_dealer_id: accountRow.preferred_dealer_id,
            },
        });
    } catch (error) {
        try { await client.query('ROLLBACK'); } catch (_) {}
        return res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    } finally {
        client.release();
    }
};

exports.me = async (req, res) => {
    const customer = req.customer;
    return res.status(200).json({
        customer_account_id: customer.id,
        customer_id: customer.customer_id,
        email: customer.email,
        phone_country_code: customer.phone_country_code,
        phone_number: customer.phone_number,
        phone_e164: customer.phone_e164,
        is_phone_verified: customer.is_phone_verified,
        preferred_dealer_id: customer.preferred_dealer_id,
        full_name: customer.full_name,
        cnic_passport_number: customer.cnic_passport_number,
        ocr_details: customer.ocr_details || {},
    });
};
