const db = require('./config/db');
async function run() {
  const [t1] = await db.query('DESCRIBE PurchaseInvoiceItems');
  console.log("--- PurchaseInvoiceItems ---");
  console.log(t1.map(c => c.Field).join(', '));
  
  const [t2] = await db.query('DESCRIBE PurchaseInvoiceItemAttributes');
  console.log("--- PurchaseInvoiceItemAttributes ---");
  console.log(t2.map(c => c.Field).join(', '));
  
  process.exit(0);
}
run();
