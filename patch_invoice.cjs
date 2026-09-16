const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `
             } else if (savedType === 'sizeset') {
               setAvailableSizes(prev => [...prev, { id: data.id || Date.now(), name: data.name, isSizeSet: true }]);
               setProducts(prev => {
                 const newP = [...prev];
                 newP[rowIndex] = {
                   ...newP[rowIndex],
                   size: data.name
                 };
                 return newP;
               });
             } else if (field) {
`;

const replacement = `
             } else if (savedType === 'sizeset') {
               setAvailableSizes(prev => [...prev, { id: data.id || Date.now(), name: data.name, isSizeSet: true }]);
               setProducts(prev => {
                 const newP = [...prev];
                 newP[rowIndex] = {
                   ...newP[rowIndex],
                   size: data.name
                 };
                 return newP;
               });
               setTimeout(() => {
                 setActiveSizeMatrixRow(rowIndex);
               }, 100);
               return; // Skip moving focus to next field
             } else if (field) {
`;

content = content.replace(target.trim(), replacement.trim());
fs.writeFileSync(file, content);
console.log('Patched Invoice');
