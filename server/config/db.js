// server/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// This uses the single connection string you saved in Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
