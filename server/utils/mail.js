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
        connectionTimeout: 30000,
        greetingTimeout: 30000,
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

const sendMailSafe = async ({ to = [], cc = [], subject, text, html, dealer = {}, attachments = [] }) => {
    const recipients = uniqueEmails(Array.isArray(to) ? to : [to]);
    const ccRecipients = uniqueEmails(Array.isArray(cc) ? cc : [cc]);

    if (recipients.length === 0) {
        return { sent: false, error: 'No email recipient available' };
    }

    const transporter = await createTransporter();
    if (!transporter) {
        return { sent: false, error: 'SMTP is not configured on the server' };
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
        return { sent: false, error: error.message };
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
