const fs = require('fs');
const path = '/Users/ratan/Downloads/RetailNodeV2/backend/routes/logisticsRoutes.js';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "module.exports = router;",
  "// Pending LRs from Purchase Invoices\nrouter.get('/pending-lrs', requirePermission('inventory', 'Read'), logisticsController.getPendingLRs);\n\nmodule.exports = router;"
);

fs.writeFileSync(path, code);
console.log('Patched logisticsRoutes.js');
