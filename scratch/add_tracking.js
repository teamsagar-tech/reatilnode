const fs = require('fs');

let backendContent = fs.readFileSync('backend/controllers/purchaseInvoiceController.js', 'utf8');

// Get IP and user ID
const varsToAdd = `
    const created_by = req.user?.id || null;
    const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
`;

backendContent = backendContent.replace(
  "const grn_no = await generateGRN(conn, req.firm_id);",
  "const grn_no = await generateGRN(conn, req.firm_id);" + varsToAdd
);

// Update SQL INSERT
backendContent = backendContent.replace(
  "(firm_id, grn_no, vendor_id, bill_no, bill_date, receive_date, total_amount, gst_amount, net_amount, narration, lr_status)",
  "(firm_id, grn_no, vendor_id, bill_no, bill_date, receive_date, total_amount, gst_amount, net_amount, narration, lr_status, created_by, ip_address)"
);

backendContent = backendContent.replace(
  "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,\n      [req.firm_id, grn_no, vendor_id, bill_no || null, bill_date || null, receive_date || null, total_amount || 0, gst_amount || 0, net_amount || 0, narration || null, lr_status]",
  "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,\n      [req.firm_id, grn_no, vendor_id, bill_no || null, bill_date || null, receive_date || null, total_amount || 0, gst_amount || 0, net_amount || 0, narration || null, lr_status, created_by, ip_address]"
);

fs.writeFileSync('backend/controllers/purchaseInvoiceController.js', backendContent);
console.log("Updated controller with tracking");
