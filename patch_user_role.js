const fs = require('fs');
const filePath = 'backend/controllers/userController.js';
let content = fs.readFileSync(filePath, 'utf8');

const oldLogic = "await db.execute('UPDATE Users SET role_id = ? WHERE id = ?', [role_id || null, id]);";
const newLogic = `
    if (role_id === 'admin' || role_id === 'user') {
      // Revert to built-in role
      await db.execute('UPDATE Users SET role = ?, role_id = NULL WHERE id = ?', [role_id, id]);
    } else {
      // Assign custom role_id, set base role to 'user'
      await db.execute('UPDATE Users SET role = "user", role_id = ? WHERE id = ?', [role_id || null, id]);
    }
`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Patched userController.js');
