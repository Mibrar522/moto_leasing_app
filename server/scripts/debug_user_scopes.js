// Run: node scripts/debug_user_scopes.js
// Lists non-super-admin users that are missing a dealer scope, plus role name.
const pool = require('../config/db');

async function main() {
  const rows = await pool.query(
    `
    SELECT
      u.id,
      u.full_name,
      u.email,
      r.role_name,
      u.dealer_id,
      e.dealer_id AS employee_dealer_id
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    LEFT JOIN employees e ON e.user_id = u.id
    WHERE COALESCE(r.role_name, '') <> 'SUPER_ADMIN'
      AND COALESCE(u.dealer_id, e.dealer_id) IS NULL
    ORDER BY r.role_name ASC, u.created_at DESC
    LIMIT 200
    `
  );

  console.log(JSON.stringify(rows.rows, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

