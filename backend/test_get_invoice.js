const db = require('./config/db');
async function test() {
  const [rows] = await db.execute('SELECT id FROM PurchaseInvoices LIMIT 1');
  if (rows.length > 0) {
    const id = rows[0].id;
    console.log("Fetching invoice ID:", id);
    const [invoiceRows] = await db.execute(`
      SELECT p.*, v.name as vendor_name
      FROM PurchaseInvoices p
      LEFT JOIN Vendors v ON p.vendor_id = v.id
      WHERE p.id = ?
    `, [id]);
    console.log(invoiceRows[0]);
  }
  process.exit(0);
}
test();
