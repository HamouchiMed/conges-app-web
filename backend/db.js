const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_32VmBptuZWsJ@ep-shiny-dawn-aqz03nsj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false },
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then((res) => {
    console.log('✅ PostgreSQL connected:', res.rows[0].now);
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err.message);
  });

module.exports = pool;
