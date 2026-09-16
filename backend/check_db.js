const mysql = require('mysql2/promise');
require('dotenv').config();
async function run() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'retailnode_db'
  });
  const [cols1] = await conn.execute('SHOW COLUMNS FROM PurchaseInvoices');
  console.log('PurchaseInvoices:', cols1.map(c => c.Field));
  
  const [cols2] = await conn.execute('SHOW COLUMNS FROM PurchaseInvoiceItemAttributes');
  console.log('PurchaseInvoiceItemAttributes:', cols2.map(c => c.Field));
  
  await conn.end();
}
run().catch(console.error);
