// Small one-off helper to inspect Hamza dealer/user/customer counts.
// Run: node server/scripts/debug_hamza_counts.js
const pool = require('../config/db');

const toInt = (value) => Number.parseInt(String(value ?? '0'), 10) || 0;

async function main() {
  const dealers = await pool.query(
    `
    SELECT id, dealer_name, dealer_code
    FROM dealers
    WHERE dealer_name ILIKE '%Hamza%'
       OR dealer_code ILIKE '%HAMZA%'
       OR dealer_name ILIKE '%Traders%'
    ORDER BY dealer_name ASC
    `
  );

  if (dealers.rows.length === 0) {
    console.log('No dealers matched "Hamza/Traders".');
    return;
  }

  for (const dealer of dealers.rows) {
    const dealerId = dealer.id;
    const usersCount = await pool.query(
      `SELECT COUNT(*)::int AS count FROM users WHERE dealer_id = $1`,
      [dealerId]
    );
    const staffCount = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM users u
      LEFT JOIN employees e ON e.user_id = u.id
      WHERE COALESCE(u.dealer_id, e.dealer_id) = $1
      `,
      [dealerId]
    );
    const customersCount = await pool.query(
      `SELECT COUNT(*)::int AS count FROM customers WHERE dealer_id = $1`,
      [dealerId]
    );
    const salesCount = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM sales_transactions st
      LEFT JOIN users u ON u.id = st.agent_id
      LEFT JOIN dealers d ON d.id = COALESCE(st.dealer_id, u.dealer_id)
      WHERE d.id = $1
      `,
      [dealerId]
    );

    console.log('---');
    console.log(`${dealer.dealer_name} (${dealer.dealer_code || 'no-code'})`);
    console.log(`dealer_id: ${dealerId}`);
    console.log(`users: ${toInt(usersCount.rows[0]?.count)}`);
    console.log(`staff_users_coalesce(users+employees): ${toInt(staffCount.rows[0]?.count)}`);
    console.log(`customers: ${toInt(customersCount.rows[0]?.count)}`);
    console.log(`sales_transactions: ${toInt(salesCount.rows[0]?.count)}`);

    // Mirror the dashboard customer registry query (common place for "0 visible" when SQL fails).
    try {
      const dashboardCustomers = await pool.query(
        `
        SELECT
            c.id,
            c.full_name,
            c.cnic_passport_number,
            c.ocr_details,
            c.biometric_hash,
            c.identity_doc_url,
            c.created_by_agent,
            creator.full_name AS created_by_name,
            creator.email AS created_by_email,
            COALESCE(c.dealer_id, creator.dealer_id) AS dealer_id,
            d.dealer_name,
            d.dealer_code
        FROM customers c
        LEFT JOIN users creator ON creator.id = c.created_by_agent
        LEFT JOIN dealers d ON d.id = COALESCE(c.dealer_id, creator.dealer_id)
        WHERE COALESCE(c.dealer_id, creator.dealer_id) = $1
        ORDER BY c.full_name ASC
        LIMIT 2000
        `,
        [dealerId]
      );
      console.log(`dashboard_customers_rows: ${dashboardCustomers.rows.length}`);
      if (dashboardCustomers.rows.length > 0) {
        const sample = dashboardCustomers.rows[0];
        console.log(
          `sample_customer: ${sample.full_name} (${sample.cnic_passport_number}) dealer_id=${sample.dealer_id}`
        );
      }
    } catch (err) {
      console.log(`dashboard_customers_query_error: ${err.message}`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
