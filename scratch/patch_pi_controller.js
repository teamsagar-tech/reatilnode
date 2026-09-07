const fs = require('fs');
const path = '/Users/ratan/Downloads/RetailNodeV2/backend/controllers/purchaseInvoiceController.js';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /const { vendor_id, bill_no, bill_date, receive_date, total_amount, gst_amount, net_amount, narration, items } = req\.body;/g,
  "const { vendor_id, bill_no, bill_date, receive_date, total_amount, gst_amount, net_amount, narration, items, lr_no, transporter, bales } = req.body;"
);

code = code.replace(
  /VALUES \(\?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?\)`,\n      \[req\.firm_id, grn_no, vendor_id, bill_no \|\| null, bill_date \|\| null, receive_date \|\| null, total_amount \|\| 0, gst_amount \|\| 0, net_amount \|\| 0, narration \|\| null, lr_status, req\.body\.purchase_order_id \|\| null, created_by, ip_address\]/g,
  "lr_no, transporter, bales, created_by, ip_address) \n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,\n      [req.firm_id, grn_no, vendor_id, bill_no || null, bill_date || null, receive_date || null, total_amount || 0, gst_amount || 0, net_amount || 0, narration || null, lr_status, req.body.purchase_order_id || null, lr_no || null, transporter || null, bales || null, created_by, ip_address]"
);

code = code.replace(
  /purchase_order_id, created_by, ip_address\) /g,
  "purchase_order_id, lr_no, transporter, bales, created_by, ip_address) "
);

// Wait, replace might be tricky with multiple lines. Let's just use string replace carefully or write a robust replace.
