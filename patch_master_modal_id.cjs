const fs = require('fs');
let mmFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let mmContent = fs.readFileSync(mmFile, 'utf8');

const oldIdHandling = `          if (resData.id) {
            data.id = resData.id;
          } else if (resData.insertId) {
            data.id = resData.insertId;
          }`;
          
const newIdHandling = `          if (resData.id) {
            data.id = resData.id;
          } else if (resData.insertId) {
            data.id = resData.insertId;
          } else if (initialId) {
            data.id = initialId;
          }`;
          
mmContent = mmContent.replace(oldIdHandling, newIdHandling);

fs.writeFileSync(mmFile, mmContent);
console.log("Patched ID handling!");
