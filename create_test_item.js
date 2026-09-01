const db = require('./config/db');
(async () => {
  try {
    const [result] = await db.execute(
      `INSERT INTO Items (firm_id, name, sku, barcode, category_id, brand_id, hsn_code, tax_percent, cost_price, selling_price, mrp, batch_tracking, min_stock_level) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, "Test Direct Insert", null, null, null, null, "1234", 18, 0, 0, 0, false, 0]
    );
    console.log("INSERT SUCCESS:", result.insertId);
  } catch (e) {
    console.error("INSERT ERROR:", e.message);
  }
  process.exit();
})();
