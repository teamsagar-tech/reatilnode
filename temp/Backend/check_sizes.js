const mysql = require('mysql2/promise');
require('dotenv').config();
async function run() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'retailnode_db'
  });
  
  const [cols] = await conn.execute("SHOW COLUMNS FROM Sizes");
  console.log('Sizes cols:', cols.map(c => c.Field));
  
  const [rows] = await conn.execute("SELECT id, name FROM Sizes LIMIT 5");
  console.log('Sizes rows:', rows);
  
  await conn.end();
}
run().catch(console.error);
