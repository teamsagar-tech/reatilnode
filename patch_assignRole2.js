const fs = require('fs');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace('let newRoleId = null;', 'let newRoleId: number | null = null;');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched types in', filePath);
  }
}

patchFile('FrontEnd/src/pages/superadmin/TenantUsers.tsx');
patchFile('FrontEndV2/src/pages/superadmin/TenantUsers.tsx');
