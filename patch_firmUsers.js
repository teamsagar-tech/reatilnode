const fs = require('fs');
const path = require('path');
const file = path.join('backend', 'controllers', 'firmController.js');
let content = fs.readFileSync(file, 'utf8');

const oldSql = "'SELECT id, name, email, mobile_no, role, is_totp_enabled, created_at FROM Users WHERE firm_id = ? ORDER BY created_at DESC',";
const newSql = "'SELECT u.id, u.name, u.email, u.mobile_no, IFNULL(r.name, u.role) as role, u.role_id, u.is_totp_enabled, u.created_at FROM Users u LEFT JOIN Roles r ON u.role_id = r.id WHERE u.firm_id = ? ORDER BY u.created_at DESC',";

content = content.replace(oldSql, newSql);
fs.writeFileSync(file, content);
console.log('Patched firmController.js');
