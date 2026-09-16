const fs = require('fs');
const file = './backend/controllers/genericMasterController.js';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(
  /const \{ name, description, is_active, tax_percent, size_group, size_scale, sizes_list, category_id \} = req\.body;/g,
  `const { name, description, is_active, tax_percent, size_group, size_scale, sizes_list, category_id } = req.body;
    console.log("CREATE MASTER REQUEST BODY:", req.body);`
);

fs.writeFileSync(file, content);
console.log('Patched with console.log');
