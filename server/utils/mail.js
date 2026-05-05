const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const dns = require('dns').promises;

const resolveSmtpHost = async (host) => {
    try {
        const addresses = await dns.resolve4(host);
        return addresses[0] || host;
    } catch (_error) {
        return host;
    }
};

const createTransporter = async () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        return null;
    }

    const resolvedHost = await resolveSmtpHost(SMTP_HOST);

    return nodemailer.createTransport({
        host: resolvedHost,
        port: Number(SMTP_PORT),
        secure: String(SMTP_SECURE).toLowerCase() === 'true',
        family: 4,
        connectionTimeout: Number(process.env.SMTP_TIMEOUT_MS || 8000),
        greetingTimeout: Number(process.env.SMTP_TIMEOUT_MS || 8000),
        tls: {
            servername: SMTP_HOST,
        },
        auth: {
            user: SMTP_USER,
            pass: String(SMTP_PASS).replace(/\s+/g, ''),
        },
    });
};

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const uniqueEmails = (emails = []) => [
    ...new Set(
        emails
            .map(normalizeEmail)
            .filter((email) => email && email.includes('@'))
    ),
];

const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const getMailerFrom = (dealer = {}) => {
    const sender = process.env.SMTP_FROM || process.env.SMTP_USER || '';
    const dealerName = String(dealer.name || dealer.dealer_name || dealer.brand_name || 'MotorLease').trim();

    return sender && dealerName
        ? `"${dealerName.replace(/"/g, '')}" <${sender}>`
        : sender;
};

const buildSignature = (dealer = {}) => {
    const dealerName = String(dealer.name || dealer.dealer_name || dealer.brand_name || 'MotorLease').trim() || 'MotorLease';
    const dealerEmail = normalizeEmail(dealer.email || dealer.contact_email || dealer.admin_email || process.env.SMTP_USER);
    const dealerPhone = [dealer.mobile_country_code, dealer.mobile_number].filter(Boolean).join(' ');

    return [
        'Thanks and regards,',
        dealerName,
        dealerEmail,
        dealerPhone,
    ].filter(Boolean).join('\n');
};

const buildHtml = ({ title, greeting, lines = [], dealer = {} }) => {
    const signatureLines = buildSignature(dealer).split('\n');

    return `
        <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.6">
            <h2 style="margin:0 0 14px;color:#0f2747">${escapeHtml(title)}</h2>
            ${greeting ? `<p>${escapeHtml(greeting)}</p>` : ''}
            ${lines.map((line) => `<p style="margin:8px 0">${escapeHtml(line)}</p>`).join('')}
            <p style="margin-top:22px">${signatureLines.map(escapeHtml).join('<br>')}</p>
        </div>
    `;
};

const resolveLocalAttachment = (fileUrl) => {
    const cleanUrl = String(fileUrl || '').trim();
    if (!cleanUrl || /^https?:\/\//i.test(cleanUrl)) {
        return null;
    }

    const relativePath = cleanUrl.replace(/^\/+/, '');
    const fullPath = path.join(__dirname, '..', relativePath);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    return {
        filename: path.basename(relativePath),
        path: fullPath,
    };
};

const buildLocalAttachments = (fileUrls = []) => fileUrls
    .map(resolveLocalAttachment)
    .filter(Boolean);

const normalizeSender = (dealer = {}) => {
    const sender = process.env.SMTP_FROM || process.env.SMTP_USER || '';
    const match = String(sender).match(/<([^>]+)>/);
    const email = normalizeEmail(match ? match[1] : sender);
    const name = String(dealer.name || dealer.dealer_name || dealer.brand_name || 'MotorLease').trim() || 'MotorLease';

    return { email, name };
};

const readAttachmentContent = (attachment) => {
    if (!attachment?.path || !fs.existsSync(attachment.path)) {
        return null;
    }

    return {
        filename: attachment.filename || path.basename(attachment.path),
        content: fs.readFileSync(attachment.path).toString('base64'),
    };
};

const sendWithBrevo = async ({ recipients, ccRecipients, subject, text, html, dealer, attachments }) => {
    const apiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
    if (!apiKey) return null;

    const sender = normalizeSender(dealer);
    if (!sender.email) {
        return { sent: false, error: 'SMTP_FROM or SMTP_USER is required for Brevo sender email' };
    }

    const payload = {
        sender,
        to: recipients.map((email) => ({ email })),
        cc: ccRecipients.map((email) => ({ email })),
        subject,
        textContent: text,
        htmlContent: html || text,
    };

    const apiAttachments = attachments.map(readAttachmentContent).filter(Boolean);
    if (apiAttachments.length > 0) {
        payload.attachment = apiAttachments;
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        return { sent: false, error: `Brevo email failed (${response.status}): ${errorBody || response.statusText}` };
    }

    return { sent: true, error: null };
};

const sendWithResend = async ({ recipients, ccRecipients, subject, text, html, dealer, attachments }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return null;

    const sender = normalizeSender(dealer);
    if (!sender.email) {
        return { sent: false, error: 'SMTP_FROM or SMTP_USER is required for Resend sender email' };
    }

    const apiAttachments = attachments.map(readAttachmentContent).filter(Boolean);
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            authorization: `Bearer ${apiKey}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            from: `${sender.name} <${sender.email}>`,
            to: recipients,
            cc: ccRecipients,
            subject,
            text,
            html: html || text,
            attachments: apiAttachments.length > 0 ? apiAttachments : undefined,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        return { sent: false, error: `Resend email failed (${response.status}): ${errorBody || response.statusText}` };
    }

    return { sent: true, error: null };
};

const sendMailSafe = async ({ to = [], cc = [], subject, text, html, dealer = {}, attachments = [] }) => {
    const recipients = uniqueEmails(Array.isArray(to) ? to : [to]);
    const ccRecipients = uniqueEmails(Array.isArray(cc) ? cc : [cc]);
    const providerErrors = [];

    if (recipients.length === 0) {
        return { sent: false, error: 'No email recipient available' };
    }

    try {
        const brevoResult = await sendWithBrevo({ recipients, ccRecipients, subject, text, html, dealer, attachments });
        if (brevoResult?.sent) {
            return brevoResult;
        }
        if (brevoResult?.error) {
            providerErrors.push(brevoResult.error);
        }

        const resendResult = await sendWithResend({ recipients, ccRecipients, subject, text, html, dealer, attachments });
        if (resendResult?.sent) {
            return resendResult;
        }
        if (resendResult?.error) {
            providerErrors.push(resendResult.error);
        }
    } catch (error) {
        providerErrors.push(error.message);
    }

    const transporter = await createTransporter();
    if (!transporter) {
        return {
            sent: false,
            error: providerErrors.length > 0
                ? providerErrors.join('; ')
                : 'Email API key or SMTP is not configured on the server',
        };
    }

    try {
        await transporter.sendMail({
            from: getMailerFrom(dealer),
            replyTo: normalizeEmail(dealer.email || dealer.contact_email || dealer.admin_email) || undefined,
            to: recipients.join(', '),
            cc: ccRecipients.length > 0 ? ccRecipients.join(', ') : undefined,
            subject,
            text,
            html,
            attachments,
        });

        return { sent: true, error: null };
    } catch (error) {
        providerErrors.push(error.message);
        return { sent: false, error: providerErrors.join('; ') };
    }
};

module.exports = {
    createTransporter,
    sendMailSafe,
    buildHtml,
    buildSignature,
    buildLocalAttachments,
    uniqueEmails,
};
