const fs = require('fs');
const filePath = 'FrontEnd/src/pages/superadmin/TenantUsers.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldOption = '<option value="">{user.role}</option>';
const newOption = '{!user.role_id && <option value="">{user.role}</option>}';

content = content.replace(oldOption, newOption);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Patched TenantUsers.tsx');
