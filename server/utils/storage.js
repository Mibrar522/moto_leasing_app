const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'moto-leasing-assets';
const SUPABASE_URL = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isSupabaseStorageConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const UPLOAD_STORAGE_DRIVER = String(process.env.UPLOAD_STORAGE_DRIVER || 'database').trim().toLowerCase();

let databaseUploadSchemaReady = false;

const ensureDatabaseUploadSchema = async () => {
    if (databaseUploadSchemaReady) {
        return;
    }

    await pool.query(`
        CREATE TABLE IF NOT EXISTS uploaded_files (
            id BIGSERIAL PRIMARY KEY,
            folder VARCHAR(160) NOT NULL DEFAULT 'uploads',
            file_name VARCHAR(255) NOT NULL,
            original_name VARCHAR(255),
            mime_type VARCHAR(160),
            file_size INTEGER,
            data BYTEA NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_uploaded_files_folder_created_at
        ON uploaded_files (folder, created_at DESC)
    `);

    databaseUploadSchemaReady = true;
};

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

const removeLocalUpload = async (file) => {
    if (!file?.path) {
        return;
    }

    try {
        await fs.promises.unlink(file.path);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.warn('Temporary upload cleanup skipped:', error.message);
        }
    }
};

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

const saveFileToDatabaseStorage = async (file, folder = 'uploads') => {
    if (!file?.path) {
        return null;
    }

    await ensureDatabaseUploadSchema();

    const folderPath = safeStoragePath(folder);
    const fileName = safeStorageSegment(file.filename || file.originalname || path.basename(file.path));
    const originalName = String(file.originalname || fileName).slice(0, 255);
    const fileBuffer = await fs.promises.readFile(file.path);

    const result = await pool.query(
        `
        INSERT INTO uploaded_files (folder, file_name, original_name, mime_type, file_size, data)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, file_name
        `,
        [
            folderPath,
            fileName,
            originalName,
            file.mimetype || 'application/octet-stream',
            Number(file.size || fileBuffer.length || 0),
            fileBuffer,
        ]
    );

    return `/api/v1/uploads/${result.rows[0].id}/${encodeURIComponent(result.rows[0].file_name)}`;
};

const getDatabaseUploadById = async (id) => {
    await ensureDatabaseUploadSchema();

    const result = await pool.query(
        `
        SELECT id, file_name, original_name, mime_type, file_size, data, created_at
        FROM uploaded_files
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

const resolveDurableUploadUrl = async (file, folder, fallbackUrl) => {
    let storedUrl = '';

    try {
        if (UPLOAD_STORAGE_DRIVER === 'supabase') {
            storedUrl = await uploadFileToSupabaseStorage(file, folder)
                || await saveFileToDatabaseStorage(file, folder)
                || fallbackUrl;
            return storedUrl;
        }

        storedUrl = await saveFileToDatabaseStorage(file, folder)
            || await uploadFileToSupabaseStorage(file, folder)
            || fallbackUrl;
        return storedUrl;
    } catch (error) {
        console.warn(`${folder} durable upload skipped:`, error.message);
        return fallbackUrl;
    } finally {
        if (storedUrl && storedUrl !== fallbackUrl) {
            await removeLocalUpload(file);
        }
    }
};

module.exports = {
    ensureDatabaseUploadSchema,
    getDatabaseUploadById,
    isSupabaseStorageConfigured,
    removeLocalUpload,
    resolveDurableUploadUrl,
    saveFileToDatabaseStorage,
    uploadFileToSupabaseStorage,
};
