// Run: node scripts/assign_inayat_admin.js
// Links abrar.khan522@gmail.com to Inayat Motors and promotes to APPLICATION_ADMIN.
const pool = require('../config/db');

async function main() {
  const dealer = await pool.query(
    `
    SELECT id, dealer_name, admin_user_id
    FROM dealers
    WHERE dealer_name ILIKE '%Inayat Motors%'
       OR application_slug = 'inayat-motors'
    LIMIT 1
    `
  );
  if (dealer.rows.length === 0) {
    throw new Error('Inayat Motors dealer not found.');
  }

  const role = await pool.query(
    `SELECT id FROM roles WHERE role_name = 'APPLICATION_ADMIN' LIMIT 1`
  );
  if (role.rows.length === 0) {
    throw new Error('APPLICATION_ADMIN role not found.');
  }

  const user = await pool.query(
    `
    SELECT id, email, dealer_id, role_id
    FROM users
    WHERE LOWER(email) = LOWER($1)
    LIMIT 1
    `,
    ['abrar.khan522@gmail.com']
  );
  if (user.rows.length === 0) {
    throw new Error('User abrar.khan522@gmail.com not found.');
  }

  const dealerId = dealer.rows[0].id;
  const userId = user.rows[0].id;

  await pool.query('BEGIN');
  try {
    await pool.query(
      `
      UPDATE users
      SET dealer_id = $1,
          role_id = $2
      WHERE id = $3
      `,
      [dealerId, role.rows[0].id, userId]
    );

    // Make this user the dealer admin profile used by dealer switching and branding.
    await pool.query(
      `
      UPDATE dealers
      SET admin_user_id = $1
      WHERE id = $2
      `,
      [userId, dealerId]
    );

    await pool.query('COMMIT');
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }

  const after = await pool.query(
    `
    SELECT
      u.id, u.email, u.dealer_id, r.role_name,
      d.dealer_name, d.admin_user_id
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    LEFT JOIN dealers d ON d.id = u.dealer_id
    WHERE u.id = $1
    `,
    [userId]
  );

  console.log(JSON.stringify(after.rows[0], null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

