const mysql = require('mysql2/promise');
require('dotenv').config();
async function run() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'retailnode_db'
  });
  const [cols] = await conn.execute('SHOW COLUMNS FROM PurchaseInvoiceItems');
  console.log('PurchaseInvoiceItems:', cols.map(c => c.Field));
  
  await conn.end();
}
run().catch(console.error);
