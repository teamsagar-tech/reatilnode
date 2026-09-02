const fs = require('fs');
const filePath = 'FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the Brand Enter key logic
const oldBrandEnter = `newProducts[index] = { ...newProducts[index], brand: selected.name || '' };`;
const newBrandEnter = `newProducts[index] = { ...newProducts[index], brand_id: selected.id, brand: selected.name || '' };`;
content = content.replace(oldBrandEnter, newBrandEnter);


// 2. Update the item autocomplete keyboard logic
const oldItemKeyboardFilter = `const filtered = availableItems.filter(s => (s.name || s.item_name || '').toLowerCase().includes(query)).slice(0, 8);`;
const newItemKeyboardFilter = `const rowBrandId = products[index].brand_id;
      const rowBrandName = (products[index].brand || '').toLowerCase();
      const filtered = availableItems.filter(s => {
        const textMatch = (s.name || s.item_name || '').toLowerCase().includes(query);
        if (rowBrandId) return textMatch && s.brand_id === rowBrandId;
        if (rowBrandName) return textMatch && (s.brand || '').toLowerCase() === rowBrandName;
        return textMatch;
      }).slice(0, 8);`;
content = content.replace(oldItemKeyboardFilter, newItemKeyboardFilter);


// 3. Update the item autocomplete mouse/render logic
const oldItemMouseFilter = `{availableItems.filter(s => (s.name || s.item_name || '').toLowerCase().includes((products[index].item || '').toLowerCase())).slice(0, 8).map((suggestion, sIdx) => (`;
const newItemMouseFilter = `{availableItems.filter(s => {
                              const q = (products[index].item || '').toLowerCase();
                              const textMatch = (s.name || s.item_name || '').toLowerCase().includes(q);
                              const bId = products[index].brand_id;
                              const bName = (products[index].brand || '').toLowerCase();
                              if (bId) return textMatch && s.brand_id === bId;
                              if (bName) return textMatch && (s.brand || '').toLowerCase() === bName;
                              return textMatch;
                            }).slice(0, 8).map((suggestion, sIdx) => (`;
content = content.replace(oldItemMouseFilter, newItemMouseFilter);


fs.writeFileSync(filePath, content, 'utf8');
console.log('Patched PurchaseInvoice item brand filtering');
