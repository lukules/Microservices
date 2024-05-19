const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'user_service',
  password: '112211',
  port: 5432,
});

module.exports = pool;
