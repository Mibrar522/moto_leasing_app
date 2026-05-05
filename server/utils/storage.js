const fs = require('fs');

const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'moto-leasing-assets';
const SUPABASE_URL = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isSupabaseStorageConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

const safeStorageSegment = (value) =>
    String(value || 'file')
        .trim()
        .replace(/\\/g, '/')
        .split('/')
        .pop()
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase() || 'file';

const safeStoragePath = (value) =>
    String(value || 'uploads')
        .trim()
        .replace(/\\/g, '/')
        .split('/')
        .map(safeStorageSegment)
        .filter(Boolean)
        .join('/') || 'uploads';

const uploadFileToSupabaseStorage = async (file, folder = 'uploads') => {
    if (!isSupabaseStorageConfigured || !file?.path) {
        return null;
    }

    const fileName = safeStorageSegment(file.filename || file.originalname);
    const objectPath = `${safeStoragePath(folder)}/${fileName}`;
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(SUPABASE_STORAGE_BUCKET)}/${objectPath}`;
    const fileBuffer = fs.readFileSync(file.path);

    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': file.mimetype || 'application/octet-stream',
            'x-upsert': 'true',
        },
        body: fileBuffer,
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`Supabase Storage upload failed (${response.status}): ${errorBody || response.statusText}`);
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(SUPABASE_STORAGE_BUCKET)}/${objectPath}`;
};

const resolveDurableUploadUrl = async (file, folder, fallbackUrl) => {
    try {
        return await uploadFileToSupabaseStorage(file, folder) || fallbackUrl;
    } catch (error) {
        console.warn(`${folder} Supabase Storage upload skipped:`, error.message);
        return fallbackUrl;
    }
};

module.exports = {
    isSupabaseStorageConfigured,
    resolveDurableUploadUrl,
    uploadFileToSupabaseStorage,
};
