const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DEFAULT_BACKUP_ROOT = path.join(__dirname, '..', 'backups', 'dealers');

const buildSafeSegment = (value, fallback) =>
    String(value || fallback || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || fallback;

const getDatabaseName = () => process.env.DB_DATABASE || 'motor_leasing_db';

const getPgDumpCommands = () => {
    if (process.env.PG_DUMP_PATH) {
        return [process.env.PG_DUMP_PATH];
    }

    return process.platform === 'win32' ? ['pg_dump.exe', 'pg_dump'] : ['pg_dump'];
};

const runPgDump = (command, args, env) =>
    new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            env,
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true,
        });

        let stderr = '';
        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        child.on('error', reject);
        child.on('close', (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(new Error(stderr.trim() || `pg_dump exited with code ${code}`));
        });
    });

exports.resolveBackupDirectory = (inputDirectory) => {
    const trimmed = String(inputDirectory || '').trim();
    return trimmed ? path.resolve(trimmed) : DEFAULT_BACKUP_ROOT;
};

exports.createDatabaseBackup = async ({
    applicationSlug,
    backupLabel,
    dealerCode,
    backupDirectory,
}) => {
    const resolvedDirectory = exports.resolveBackupDirectory(backupDirectory);
    fs.mkdirSync(resolvedDirectory, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${buildSafeSegment(applicationSlug, buildSafeSegment(dealerCode, 'dealer'))}_${buildSafeSegment(backupLabel, 'backup')}_${timestamp}.sql`;
    const filePath = path.join(resolvedDirectory, fileName);

    const args = [
        '-h', process.env.DB_HOST || 'localhost',
        '-p', String(process.env.DB_PORT || 5432),
        '-U', process.env.DB_USER || 'postgres',
        '-d', getDatabaseName(),
        '--encoding=UTF8',
        '--clean',
        '--if-exists',
        '--schema-only',
        '--no-owner',
        '--no-privileges',
        '-f', filePath,
    ];

    const env = {
        ...process.env,
        PGPASSWORD: process.env.DB_PASSWORD || '',
    };

    const commands = getPgDumpCommands();
    let lastError = null;

    for (const command of commands) {
        try {
            await runPgDump(command, args, env);
            return {
                status: 'COMPLETED',
                backup_type: 'EMPTY_TEMPLATE',
                directory: resolvedDirectory,
                file_name: fileName,
                file_path: filePath,
                command,
            };
        } catch (error) {
            lastError = error;
        }
    }

    return {
        status: 'FAILED',
        backup_type: 'EMPTY_TEMPLATE',
        directory: resolvedDirectory,
        file_name: fileName,
        file_path: filePath,
        error: lastError?.message || 'Unable to create database backup',
    };
};
