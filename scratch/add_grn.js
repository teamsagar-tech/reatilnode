const fs = require('fs');

// 1. Update backend
let backendContent = fs.readFileSync('backend/controllers/purchaseInvoiceController.js', 'utf8');
backendContent = backendContent.replace(
  "res.status(201).json({ message: 'Purchase Invoice created successfully', id: invoiceId });",
  "res.status(201).json({ message: 'Purchase Invoice created successfully', id: invoiceId, grn_no });"
);
fs.writeFileSync('backend/controllers/purchaseInvoiceController.js', backendContent);

// 2. Update frontend
let frontendContent = fs.readFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'utf8');
frontendContent = frontendContent.replace(
  "alert('Purchase Invoice Saved Successfully!');",
  "alert(`Purchase Invoice Saved Successfully! GRN No: ${data.grn_no}`);"
);
fs.writeFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', frontendContent);

console.log("Updated files");
