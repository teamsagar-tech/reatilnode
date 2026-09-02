const fs = require('fs');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const oldUpdate = 'setUsers(users.map(u => u.id === userId ? { ...u, role_id: parseInt(roleId, 10) || null, role: roles.find(r => r.id === parseInt(roleId, 10))?.name || u.role } : u));';
    const newUpdate = `setUsers(users.map(u => {
        if (u.id !== userId) return u;
        let newRoleId = null;
        let newRoleName = u.role;
        if (roleId === 'admin' || roleId === 'user' || roleId === 'superadmin') {
          newRoleName = roleId;
        } else {
          newRoleId = parseInt(roleId, 10);
          newRoleName = roles.find(r => r.id === newRoleId)?.name || u.role;
        }
        return { ...u, role_id: newRoleId, role: newRoleName };
      }));`;

    content = content.replace(oldUpdate, newUpdate);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched', filePath);
  }
}

patchFile('FrontEnd/src/pages/superadmin/TenantUsers.tsx');
patchFile('FrontEndV2/src/pages/superadmin/TenantUsers.tsx');
