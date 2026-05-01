// Run: node scripts/debug_inayat_link.js
// Shows dealer(s) matching "Inayat" and the user record for abrar.khan522@gmail.com
const pool = require('../config/db');

async function main() {
  const dealers = await pool.query(
    `
    SELECT id, dealer_name, dealer_code, application_slug, admin_user_id
    FROM dealers
    WHERE dealer_name ILIKE '%Inayat%'
       OR application_slug ILIKE '%inayat%'
    ORDER BY dealer_name ASC
    `
  );

  const user = await pool.query(
    `
    SELECT u.id, u.full_name, u.email, u.role_id, r.role_name, u.dealer_id, u.is_active
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    WHERE LOWER(u.email) = LOWER($1)
    LIMIT 1
    `,
    ['abrar.khan522@gmail.com']
  );

  console.log('dealers:', JSON.stringify(dealers.rows, null, 2));
  console.log('user:', JSON.stringify(user.rows[0] || null, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

