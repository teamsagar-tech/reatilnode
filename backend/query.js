const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });
async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME
  });
  const [tables] = await conn.query('SHOW TABLES');
  console.log(tables.map(t => Object.values(t)[0]));
  process.exit(0);
}
run();
