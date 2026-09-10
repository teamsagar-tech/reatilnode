const db = require('./config/db');
async function run() {
  await db.query(`INSERT INTO Vendors (firm_id, name, group_id) VALUES (1, 'Test Vendor', 1)`);
  const [vendor] = await db.query('SELECT id FROM Vendors LIMIT 1');
  
  await db.query(`INSERT INTO PurchaseInvoices (firm_id, vendor_id, bill_no, total_amount) VALUES (1, ?, 'BILL-001', 100)`, [vendor[0].id]);
  const [invoice] = await db.query('SELECT id FROM PurchaseInvoices LIMIT 1');
  
  const id = invoice[0].id;
  console.log("Created invoice with ID:", id);
  
  const [invoiceRows] = await db.execute(`
      SELECT p.*, v.name as vendor_name
      FROM PurchaseInvoices p
      LEFT JOIN Vendors v ON p.vendor_id = v.id
      WHERE p.id = ?
    `, [id]);
    
  console.log("Header Result:", invoiceRows[0]);
  process.exit(0);
}
run();
