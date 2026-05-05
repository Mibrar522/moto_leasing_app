const pool = require('../config/db');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { syncCustomerCoreSchema } = require('../utils/customerCoreBootstrap');
const { buildHtml, buildLocalAttachments, sendMailSafe } = require('../utils/mail');
const { uploadFileToSupabaseStorage } = require('../utils/storage');

const LOCAL_TESSDATA_DIR = path.join(__dirname, '..', 'tessdata');
const OCR_LANGS = ['eng', 'urd'];
const ensureTrainedDataGzip = (lang) => {
    const trainedDataPath = path.join(LOCAL_TESSDATA_DIR, `${lang}.traineddata`);
    const trainedDataGzPath = path.join(LOCAL_TESSDATA_DIR, `${lang}.traineddata.gz`);

    if (!fs.existsSync(trainedDataGzPath) && fs.existsSync(trainedDataPath)) {
        fs.writeFileSync(trainedDataGzPath, zlib.gzipSync(fs.readFileSync(trainedDataPath)));
    }

    return fs.existsSync(trainedDataPath) || fs.existsSync(trainedDataGzPath);
};
const OCR_LANG_READY = Object.fromEntries(
    OCR_LANGS.map((lang) => [lang, ensureTrainedDataGzip(lang)])
);
const OCR_ENGINE_READY = OCR_LANG_READY.eng || OCR_LANG_READY.urd;
const OCR_UNAVAILABLE_MESSAGE = 'Automatic OCR is not ready on this server yet. Upload succeeded, but OCR text was not extracted.';
const isSuperAdminSession = (user = {}) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';
const hasFeature = (user = {}, featureKey) =>
    Array.isArray(user?.feature_keys) && user.feature_keys.includes(featureKey);

const normalizeOcrDetails = (ocrDetails = {}) => {
    if (!ocrDetails || Array.isArray(ocrDetails)) {
        return {};
    }

    if (typeof ocrDetails === 'string') {
        try {
            return JSON.parse(ocrDetails);
        } catch (error) {
            return { raw_text: ocrDetails };
        }
    }

    return ocrDetails;
};

const mapCustomerRow = (row) => {
    const ocrDetails = normalizeOcrDetails(row.ocr_details);
    const fingerprint = ocrDetails.fingerprint || {};

    return {
        ...row,
        ocr_details: ocrDetails,
        document_type: ocrDetails.document_type || '',
        contact_email: ocrDetails.contact_email || '',
        contact_phone: ocrDetails.contact_phone || '',
        gender: ocrDetails.gender || '',
        country: ocrDetails.country || '',
        address: ocrDetails.address || '',
        date_of_birth: ocrDetails.date_of_birth || '',
        father_name: ocrDetails.father_name || '',
        extracted_name: ocrDetails.extracted_name || '',
        raw_ocr_text: ocrDetails.raw_ocr_text || '',
        identity_doc_back_url: ocrDetails.identity_doc_back_url || '',
        signature_image_url: ocrDetails.signature_image_url || '',
        fingerprint_status: fingerprint.status || (row.biometric_hash ? 'ENROLLED' : 'NOT_CAPTURED'),
        fingerprint_quality: fingerprint.quality || '',
        fingerprint_device: fingerprint.device || '',
        fingerprint_thumb_url: fingerprint.thumb_image_url || '',
        created_by_email: row.created_by_email || '',
        dealer_id: row.dealer_id || '',
        dealer_name: row.dealer_name || '',
        dealer_code: row.dealer_code || '',
    };
};

const buildCustomerPayload = (body, userId, includeCreator = true) => {
    const {
        full_name,
        cnic_passport_number,
        identity_doc_url,
        biometric_hash,
        ocr_details,
        document_type,
        contact_email,
        contact_phone,
        gender,
        country,
        address,
        date_of_birth,
        father_name,
        extracted_name,
        raw_ocr_text,
        fingerprint_status,
        fingerprint_quality,
        fingerprint_device,
        identity_doc_back_url,
        signature_image_url,
        fingerprint_thumb_url,
    } = body;

    const currentOcrDetails = normalizeOcrDetails(ocr_details);
    const currentFingerprint = currentOcrDetails.fingerprint || {};

    const mergedOcrDetails = {
        ...currentOcrDetails,
        document_type: document_type || currentOcrDetails.document_type || '',
        contact_email: contact_email || currentOcrDetails.contact_email || '',
        contact_phone: contact_phone || currentOcrDetails.contact_phone || '',
        gender: gender || currentOcrDetails.gender || '',
        country: country || currentOcrDetails.country || '',
        address: address || currentOcrDetails.address || '',
        date_of_birth: date_of_birth || currentOcrDetails.date_of_birth || '',
        father_name: father_name || currentOcrDetails.father_name || '',
        extracted_name: extracted_name || currentOcrDetails.extracted_name || '',
        raw_ocr_text: raw_ocr_text || currentOcrDetails.raw_ocr_text || '',
        identity_doc_back_url: identity_doc_back_url || currentOcrDetails.identity_doc_back_url || '',
        signature_image_url: signature_image_url || currentOcrDetails.signature_image_url || '',
        fingerprint: {
            ...currentFingerprint,
            status: fingerprint_status || currentFingerprint.status || (biometric_hash ? 'ENROLLED' : 'NOT_CAPTURED'),
            quality: fingerprint_quality || currentFingerprint.quality || '',
            device: fingerprint_device || currentFingerprint.device || '',
            thumb_image_url: fingerprint_thumb_url || currentFingerprint.thumb_image_url || '',
            enrolled_at: biometric_hash
                ? currentFingerprint.enrolled_at || new Date().toISOString()
                : currentFingerprint.enrolled_at || '',
        },
        last_reviewed_at: new Date().toISOString(),
    };

    const values = [
        full_name,
        cnic_passport_number,
        mergedOcrDetails,
        biometric_hash || null,
        identity_doc_url || null,
    ];

    if (includeCreator) {
        values.push(userId);
    }

    return values;
};

const getCustomerDealerMailContext = async (dealerId, creatorId) => {
    const result = await pool.query(
        `
        SELECT
            d.dealer_name,
            d.contact_email,
            d.mobile_country_code,
            d.mobile_number,
            creator.email AS creator_email,
            creator.full_name AS creator_name,
            admin_user.email AS admin_email
        FROM dealers d
        LEFT JOIN users admin_user ON admin_user.id = d.admin_user_id
        LEFT JOIN users creator ON creator.id = $2
        WHERE d.id = $1
        LIMIT 1
        `,
        [dealerId, creatorId]
    );

    const row = result.rows[0] || {};
    return {
        name: row.dealer_name || row.creator_name || 'MotorLease',
        email: row.contact_email || row.admin_email || row.creator_email || process.env.SMTP_USER,
        admin_email: row.admin_email,
        creator_email: row.creator_email,
        mobile_country_code: row.mobile_country_code,
        mobile_number: row.mobile_number,
    };
};

const sendCustomerCreatedEmails = async (customer, creatorId) => {
    const ocrDetails = normalizeOcrDetails(customer.ocr_details);
    const customerEmail = ocrDetails.contact_email;
    const dealerMail = await getCustomerDealerMailContext(customer.dealer_id, creatorId);
    const dealerRecipients = [dealerMail.email, dealerMail.admin_email, dealerMail.creator_email];
    const attachmentUrls = [
        customer.identity_doc_url,
        ocrDetails.identity_doc_back_url,
        ocrDetails.signature_image_url,
        ocrDetails.fingerprint?.thumb_image_url,
    ];
    const attachments = buildLocalAttachments(attachmentUrls);

    const customerLines = [
        `Your customer profile has been created with ${dealerMail.name}.`,
        `Customer name: ${customer.full_name}`,
        `CNIC / Passport: ${customer.cnic_passport_number}`,
        'Please contact the dealer if any information needs correction.',
    ];

    const dealerLines = [
        `A new customer profile has been created.`,
        `Customer name: ${customer.full_name}`,
        `CNIC / Passport: ${customer.cnic_passport_number}`,
        customerEmail ? `Customer email: ${customerEmail}` : '',
        ocrDetails.contact_phone ? `Customer phone: ${ocrDetails.contact_phone}` : '',
    ].filter(Boolean);

    const results = [];

    if (customerEmail) {
        results.push(await sendMailSafe({
            dealer: dealerMail,
            to: customerEmail,
            subject: `Customer profile created - ${dealerMail.name}`,
            text: [
                `Dear ${customer.full_name},`,
                '',
                ...customerLines,
                '',
                `Thanks and regards,\n${dealerMail.name}\n${dealerMail.email || ''}`,
            ].join('\n'),
            html: buildHtml({
                title: 'Customer Profile Created',
                greeting: `Dear ${customer.full_name},`,
                lines: customerLines,
                dealer: dealerMail,
            }),
        }));
    }

    results.push(await sendMailSafe({
        dealer: dealerMail,
        to: dealerRecipients,
        subject: `New customer created - ${customer.full_name}`,
        text: [
            'Dear team,',
            '',
            ...dealerLines,
            '',
            attachments.length > 0 ? 'Customer documents are attached.' : 'No customer document attachment was available.',
            '',
            `Thanks and regards,\n${dealerMail.name}\n${dealerMail.email || ''}`,
        ].join('\n'),
        html: buildHtml({
            title: 'New Customer Created',
            greeting: 'Dear team,',
            lines: [
                ...dealerLines,
                attachments.length > 0 ? 'Customer documents are attached.' : 'No customer document attachment was available.',
            ],
            dealer: dealerMail,
        }),
        attachments,
    }));

    return results;
};

exports.listCustomers = async (req, res) => {
    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const result = await pool.query(
            `
            SELECT
                c.id,
                c.full_name,
                c.cnic_passport_number,
                c.ocr_details,
                c.biometric_hash,
                c.identity_doc_url,
                c.dealer_id,
                c.created_by_agent,
                creator.full_name AS created_by_name,
                creator.email AS created_by_email,
                creator.dealer_id AS creator_dealer_id,
                d.dealer_name,
                d.dealer_code
            FROM customers c
            LEFT JOIN users creator ON creator.id = c.created_by_agent
            LEFT JOIN dealers d ON d.id = c.dealer_id
            ${isSuperAdmin ? '' : 'WHERE c.dealer_id = $1'}
            ORDER BY c.full_name ASC
            `,
            isSuperAdmin ? [] : [req.user.dealer_id]
        );

        res.status(200).json(result.rows.map(mapCustomerRow));
    } catch (error) {
        res.status(500).json({ message: 'Failed to load customers', error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const result = await pool.query(
            `
            SELECT
                c.id,
                c.full_name,
                c.cnic_passport_number,
                c.ocr_details,
                c.biometric_hash,
                c.identity_doc_url,
                c.dealer_id,
                c.created_by_agent,
                creator.full_name AS created_by_name,
                creator.email AS created_by_email,
                creator.dealer_id AS creator_dealer_id,
                d.dealer_name,
                d.dealer_code
            FROM customers c
            LEFT JOIN users creator ON creator.id = c.created_by_agent
            LEFT JOIN dealers d ON d.id = c.dealer_id
            WHERE c.id = $1
            ${isSuperAdmin ? '' : 'AND c.dealer_id = $2'}
            `,
            isSuperAdmin ? [req.params.id] : [req.params.id, req.user.dealer_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(mapCustomerRow(result.rows[0]));
    } catch (error) {
        res.status(500).json({ message: 'Failed to load customer', error: error.message });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const canUnlockOwnership = hasFeature(req.user, 'FEAT_CUSTOMER_OWNERSHIP_UNLOCK');
        if (!req.body.full_name || !req.body.cnic_passport_number) {
            return res.status(400).json({ message: 'Full name and CNIC/Passport number are required' });
        }

        let effectiveCreatedByAgent = req.user.id;
        if (canUnlockOwnership && req.body.created_by_agent) {
            const ownerCheck = await pool.query(
                `
                SELECT u.id, u.dealer_id
                FROM users u
                WHERE u.id = $1
                ${isSuperAdmin ? '' : 'AND u.dealer_id = $2'}
                `,
                isSuperAdmin ? [req.body.created_by_agent] : [req.body.created_by_agent, req.user.dealer_id]
            );

            if (ownerCheck.rows.length === 0) {
                return res.status(400).json({ message: 'Selected customer owner is invalid for the current dealer scope.' });
            }

            effectiveCreatedByAgent = ownerCheck.rows[0].id;
        } else if (req.body.created_by_agent && String(req.body.created_by_agent) !== String(req.user.id)) {
            return res.status(400).json({ message: 'Customer ownership is locked on new customer creation for this account.' });
        }

        const ownerDealerCheck = await pool.query(
            'SELECT dealer_id FROM users WHERE id = $1',
            [effectiveCreatedByAgent]
        );
        const effectiveDealerId = ownerDealerCheck.rows[0]?.dealer_id || null;

        if (!canUnlockOwnership && !effectiveDealerId) {
            return res.status(400).json({ message: 'Customer ownership is locked for this account. Switch into a dealer profile or enable the unlock feature before creating a new customer.' });
        }

        const values = buildCustomerPayload(req.body, effectiveCreatedByAgent, true);

        const insertCustomer = async () => pool.query(
            `
            INSERT INTO customers (
                full_name,
                cnic_passport_number,
                ocr_details,
                biometric_hash,
                identity_doc_url,
                created_by_agent,
                dealer_id
            )
            VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7)
            RETURNING *
            `,
            [...values, effectiveDealerId]
        );

        let result;
        try {
            result = await insertCustomer();
        } catch (dbError) {
            // If the DB is older and missing columns, sync schema and retry once.
            const msg = String(dbError?.message || '');
            if (msg.includes('column') && msg.includes('customers')) {
                await syncCustomerCoreSchema();
                result = await insertCustomer();
            } else {
                throw dbError;
            }
        }

        const createdCustomer = mapCustomerRow(result.rows[0]);

        sendCustomerCreatedEmails(createdCustomer, effectiveCreatedByAgent)
            .then((results) => {
                const failed = results.filter((entry) => entry && !entry.sent);
                if (failed.length > 0) {
                    console.warn('Customer created email warning:', failed.map((entry) => entry.error).join('; '));
                }
            })
            .catch((mailError) => console.warn('Customer created email warning:', mailError.message));

        res.status(201).json({ ...createdCustomer, email_delivery: [{ sent: false, pending: true, error: null }] });
    } catch (error) {
        if (error?.code === '23505') {
            const constraint = String(error?.constraint || '');
            const isCnicUnique = constraint === 'customers_cnic_passport_number_key';

            let existingCustomer = null;
            if (isCnicUnique) {
                try {
                    const isSuperAdmin = isSuperAdminSession(req.user);
                    const existingResult = await pool.query(
                        `
                        SELECT
                            c.id,
                            c.full_name,
                            c.cnic_passport_number,
                            c.ocr_details,
                            c.biometric_hash,
                            c.identity_doc_url,
                            c.dealer_id,
                            c.created_by_agent,
                            creator.full_name AS created_by_name,
                            creator.email AS created_by_email,
                            d.dealer_name,
                            d.dealer_code
                        FROM customers c
                        LEFT JOIN users creator ON creator.id = c.created_by_agent
                        LEFT JOIN dealers d ON d.id = c.dealer_id
                        WHERE c.cnic_passport_number = $1
                          ${isSuperAdmin ? '' : 'AND c.dealer_id = $2'}
                        LIMIT 1
                        `,
                        isSuperAdmin
                            ? [req.body.cnic_passport_number]
                            : [req.body.cnic_passport_number, req.user.dealer_id]
                    );
                    if (existingResult.rows.length > 0) {
                        existingCustomer = mapCustomerRow(existingResult.rows[0]);
                    }
                } catch (_) {
                    existingCustomer = null;
                }
            }

            return res.status(409).json({
                message: isCnicUnique
                    ? 'Customer already exists with this CNIC / Passport number.'
                    : 'Duplicate customer record.',
                error: error.detail || error.message,
                existing_customer: existingCustomer,
            });
        }
        res.status(500).json({ message: 'Failed to create customer', error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const canUnlockOwnership = hasFeature(req.user, 'FEAT_CUSTOMER_OWNERSHIP_UNLOCK');
        if (req.body.created_by_agent && !canUnlockOwnership) {
            return res.status(400).json({ message: 'Customer ownership is locked after creation.' });
        }

        const existing = await pool.query(
            `
            SELECT c.*
            FROM customers c
            WHERE c.id = $1
            ${isSuperAdmin ? '' : 'AND c.dealer_id = $2'}
            `,
            isSuperAdmin ? [req.params.id] : [req.params.id, req.user.dealer_id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const current = mapCustomerRow(existing.rows[0]);
        let nextCreatedByAgent = current.created_by_agent || req.user.id;
        if (canUnlockOwnership && req.body.created_by_agent) {
            const ownerCheck = await pool.query(
                `
                SELECT u.id, u.dealer_id
                FROM users u
                WHERE u.id = $1
                ${isSuperAdmin ? '' : 'AND u.dealer_id = $2'}
                `,
                isSuperAdmin ? [req.body.created_by_agent] : [req.body.created_by_agent, req.user.dealer_id]
            );

            if (ownerCheck.rows.length === 0) {
                return res.status(400).json({ message: 'Selected customer owner is invalid for the current dealer scope.' });
            }

            nextCreatedByAgent = ownerCheck.rows[0].id;
        }
        const nextDealerId = req.body.dealer_id || current.dealer_id || req.user.dealer_id || null;

        const mergedBody = {
            ...current,
            ...req.body,
            ocr_details: {
                ...normalizeOcrDetails(current.ocr_details),
                ...normalizeOcrDetails(req.body.ocr_details),
            },
        };

        const values = buildCustomerPayload(mergedBody, nextCreatedByAgent, false);
        const customerId = req.params.id;

        const result = await pool.query(
            `
            UPDATE customers
            SET
                full_name = $1,
                cnic_passport_number = $2,
                ocr_details = $3::jsonb,
                biometric_hash = $4,
                identity_doc_url = $5,
                dealer_id = $7,
                created_by_agent = $8
            WHERE id = $6
            RETURNING *
            `,
            [...values, customerId, nextDealerId, nextCreatedByAgent]
        );

        res.status(200).json(mapCustomerRow(result.rows[0]));
    } catch (error) {
        if (error?.code === '23505') {
            const constraint = String(error?.constraint || '');
            const isCnicUnique = constraint === 'customers_cnic_passport_number_key';

            let existingCustomer = null;
            if (isCnicUnique) {
                try {
                    const isSuperAdmin = isSuperAdminSession(req.user);
                    const existingResult = await pool.query(
                        `
                        SELECT
                            c.id,
                            c.full_name,
                            c.cnic_passport_number,
                            c.ocr_details,
                            c.biometric_hash,
                            c.identity_doc_url,
                            c.dealer_id,
                            c.created_by_agent,
                            creator.full_name AS created_by_name,
                            creator.email AS created_by_email,
                            d.dealer_name,
                            d.dealer_code
                        FROM customers c
                        LEFT JOIN users creator ON creator.id = c.created_by_agent
                        LEFT JOIN dealers d ON d.id = c.dealer_id
                        WHERE c.cnic_passport_number = $1
                          ${isSuperAdmin ? '' : 'AND c.dealer_id = $2'}
                        LIMIT 1
                        `,
                        isSuperAdmin
                            ? [req.body.cnic_passport_number]
                            : [req.body.cnic_passport_number, req.user.dealer_id]
                    );
                    if (existingResult.rows.length > 0) {
                        existingCustomer = mapCustomerRow(existingResult.rows[0]);
                    }
                } catch (_) {
                    existingCustomer = null;
                }
            }

            return res.status(409).json({
                message: isCnicUnique
                    ? 'Another customer already exists with this CNIC / Passport number.'
                    : 'Duplicate customer record.',
                error: error.detail || error.message,
                existing_customer: existingCustomer,
            });
        }
        res.status(500).json({ message: 'Failed to update customer', error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const isSuperAdmin = isSuperAdminSession(req.user);
        const result = await pool.query(
            `
            DELETE FROM customers c
            WHERE c.id = $1
              ${isSuperAdmin ? '' : 'AND c.dealer_id = $2'}
            RETURNING c.id, c.full_name
            `,
            isSuperAdmin ? [req.params.id] : [req.params.id, req.user.dealer_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted', customer: result.rows[0] });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({ message: 'This customer is linked to sales or installment records and cannot be deleted.' });
        }
        res.status(500).json({ message: 'Failed to delete customer', error: error.message });
    }
};

exports.uploadCustomerAsset = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Customer file is required' });
        }

        const assetType = String(req.body.assetType || '').trim();
        let ocr = null;

        if (assetType === 'CNIC_FRONT' || assetType === 'CNIC_BACK') {
            try {
                if (!OCR_ENGINE_READY) {
                    ocr = {
                        raw_text: '',
                        confidence: 0,
                        error: OCR_UNAVAILABLE_MESSAGE,
                    };
                } else if (String(req.file.mimetype || '').startsWith('image/')) {
                    const activeLangs = assetType === 'CNIC_BACK' && OCR_LANG_READY.urd
                        ? (OCR_LANG_READY.eng ? 'eng+urd' : 'urd')
                        : (OCR_LANG_READY.eng ? 'eng' : 'urd');
                    const result = await Tesseract.recognize(req.file.path, activeLangs, {
                        langPath: LOCAL_TESSDATA_DIR,
                    });
                    const rawText = String(result?.data?.text || '').trim();
                    ocr = {
                        raw_text: rawText,
                        confidence: Number(result?.data?.confidence || 0),
                        source: 'image_ocr',
                        languages: activeLangs,
                        verified: Boolean(rawText),
                    };
                } else if (String(req.file.mimetype || '').startsWith('text/')) {
                    const rawText = fs.readFileSync(req.file.path, 'utf8').trim();
                    ocr = {
                        raw_text: rawText,
                        confidence: 100,
                        source: 'text_import',
                        verified: Boolean(rawText),
                    };
                } else {
                    ocr = {
                        raw_text: '',
                        confidence: 0,
                        error: 'Automatic OCR currently works on image files. Other file types are uploaded only.',
                    };
                }
            } catch (ocrError) {
                ocr = {
                    raw_text: '',
                    confidence: 0,
                    error: ocrError.message || OCR_UNAVAILABLE_MESSAGE,
                    verified: false,
                };
            }
        }

        let durableUrl = null;

        try {
            durableUrl = await uploadFileToSupabaseStorage(req.file, 'customers');
        } catch (storageError) {
            console.warn('Customer asset Supabase Storage upload skipped:', storageError.message);
        }

        res.status(201).json({
            url: durableUrl || `/uploads/customers/${req.file.filename}`,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            ocr,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload customer file', error: error.message });
    }
};
