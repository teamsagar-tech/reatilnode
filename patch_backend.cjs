const fs = require('fs');
const file = './backend/controllers/genericMasterController.js';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(
  /\} else if \(tableName === 'PartySubCategories'\) \{\n\s*query = `INSERT INTO \$\{tableName\} \(firm_id, category_id, name\) VALUES \(\?, \?, \?\)`\;\n\s*params = \[req\.firm_id, category_id, name\]\;\n\s*\}/g,
  `} else if (tableName === 'PartySubCategories') {
        if (!category_id) return res.status(400).json({ error: 'Category ID is required for subcategory' });
        query = \`INSERT INTO \${tableName} (firm_id, category_id, name) VALUES (?, ?, ?)\`;
        params = [req.firm_id, category_id, name];
      }`
);

fs.writeFileSync(file, content);
console.log('Patched genericMasterController.js');
