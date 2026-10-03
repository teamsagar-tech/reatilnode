const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/accounting/PartyMaster.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(/onChange=\{\(v\) =>/g, 'onChange={(v: any) =>');
data = data.replace(/newContacts\[index\].type/g, '(newContacts[index] as any).type');
data = data.replace(/newContacts\[index\].name/g, '(newContacts[index] as any).name');
data = data.replace(/newContacts\[index\].mobile/g, '(newContacts[index] as any).mobile');
data = data.replace(/formData\.contacts \|\| \[\]/g, '(formData.contacts as any[]) || []');

fs.writeFileSync(file, data);
