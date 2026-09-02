const fs = require('fs');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the old buggy select logic
    const oldSelectRegex = /<select[\s\S]*?value=\{user\.role_id \|\| ''\}[\s\S]*?onChange=\{\(e\) => assignRole\(user\.id, e\.target\.value\)\}[\s\S]*?>[\s\S]*?<\/select>/m;
    
    const newSelect = `<select 
                            className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded-full outline-none cursor-pointer"
                            value={user.role_id || user.role || ''}
                            onChange={(e) => assignRole(user.id, e.target.value)}
                          >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <optgroup label="Custom Roles">
                              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </optgroup>
                          </select>`;

    content = content.replace(oldSelectRegex, newSelect);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched', filePath);
  }
}

patchFile('FrontEnd/src/pages/superadmin/TenantUsers.tsx');
patchFile('FrontEndV2/src/pages/superadmin/TenantUsers.tsx');
