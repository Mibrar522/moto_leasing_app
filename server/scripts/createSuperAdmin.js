const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const [fullName, email, password] = process.argv.slice(2);

if (!fullName || !email || !password) {
    console.error('Usage: node scripts/createSuperAdmin.js "Full Name" "email@example.com" "StrongPassword123"');
    process.exit(1);
}

(async () => {
    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            console.error('A user with that email already exists.');
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `
            INSERT INTO users (full_name, email, password_hash, role_id, is_active)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, full_name, email, role_id
            `,
            [fullName, email, hashedPassword, 1, true]
        );

        console.log('Super admin created:');
        console.log(JSON.stringify(result.rows[0], null, 2));
    } catch (error) {
        console.error('Failed to create super admin:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
