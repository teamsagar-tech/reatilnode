const db = require('./Backend/config/db');
async function run() {
  const [rows] = await db.execute('SELECT id, vendor_id, lr_no, transporter, bales, lr_status FROM PurchaseInvoices ORDER BY id DESC LIMIT 10');
  console.log(rows);
  process.exit();
}
run();
