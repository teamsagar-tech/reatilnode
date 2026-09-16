const mysql = require('mysql2/promise');
require('dotenv').config();
async function run() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'retailnode_db'
  });
  
  console.log('Adding columns to PurchaseInvoices...');
  try {
    await conn.execute('ALTER TABLE PurchaseInvoices ADD COLUMN freight DECIMAL(15,2) DEFAULT 0, ADD COLUMN insurance DECIMAL(15,2) DEFAULT 0, ADD COLUMN packing_charges DECIMAL(15,2) DEFAULT 0;');
    console.log('Success PurchaseInvoices');
  } catch(e) { console.log(e.message); }

  console.log('Adding columns to PurchaseInvoiceItems...');
  try {
    await conn.execute('ALTER TABLE PurchaseInvoiceItems ADD COLUMN size_group_id INT NULL;');
    console.log('Success PurchaseInvoiceItems');
  } catch(e) { console.log(e.message); }
  
  console.log('Adding columns to PurchaseInvoiceItemAttributes...');
  try {
    await conn.execute('ALTER TABLE PurchaseInvoiceItemAttributes ADD COLUMN purchase_rate DECIMAL(15,2) NULL, ADD COLUMN mrp DECIMAL(15,2) NULL;');
    console.log('Success PurchaseInvoiceItemAttributes');
  } catch(e) { console.log(e.message); }

  await conn.end();
}
run().catch(console.error);
