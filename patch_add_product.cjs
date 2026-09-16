const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const regex1 = /const addProduct = \(\) => \{\n    setProducts\(prev => \{\n      const last = prev\.length > 0 \? prev\[prev\.length - 1\] : null;\n      return \[\.\.\.prev, \{ \n        id: Date\.now\(\), \n        item_id: null,\n        item: '', \n        hsn: '',\n        brand: last \? \(last\.brand \|\| ''\) : '', \n        brand_id: last \? \(last\.brand_id \|\| null\) : null,\n        qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 \n      \}\];\n    \}\);\n  \};/;

const replacement1 = `const addProduct = () => {
    setProducts(prev => {
      const last = prev.length > 0 ? prev[prev.length - 1] : null;
      return [...prev, { 
        id: Date.now(), 
        item_id: null,
        item: '', 
        hsn: '',
        brand: last ? (last.brand || '') : '', 
        brand_id: last ? (last.brand_id || null) : null,
        qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, 
        disc: last ? (last.disc || 0) : 0, 
        gst: 0, design: '', colour: '', size: '', mrp: 0 
      }];
    });
  };`;

piContent = piContent.replace(regex1, replacement1);

const regex2 = /if \(activeSizeMatrixRow === prev\.length - 1\) \{\n              const last = newProducts\[activeSizeMatrixRow\];\n              newProducts\.push\(\{ \n                id: Date\.now\(\), \n                item_id: null,\n                item: '', \n                hsn: '',\n                brand: last \? \(last\.brand \|\| ''\) : '', \n                brand_id: last \? \(last\.brand_id \|\| null\) : null,\n                qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 \n              \}\);\n            \}/;

const replacement2 = `if (activeSizeMatrixRow === prev.length - 1) {
              const last = newProducts[activeSizeMatrixRow];
              newProducts.push({ 
                id: Date.now(), 
                item_id: null,
                item: '', 
                hsn: '',
                brand: last ? (last.brand || '') : '', 
                brand_id: last ? (last.brand_id || null) : null,
                qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, 
                disc: last ? (last.disc || 0) : 0, 
                gst: 0, design: '', colour: '', size: '', mrp: 0 
              });
            }`;

piContent = piContent.replace(regex2, replacement2);

fs.writeFileSync(piFile, piContent);
console.log("Patched correctly!");
