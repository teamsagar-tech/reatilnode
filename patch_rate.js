const fs = require('fs');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // In handleKeyDown for item
    const oldStr1 = "newProducts[index] = { ...newProducts[index], item_id: selected.id, item: selected.name || selected.item_name, brand_id: selected.brand_id || null, brand: selected.brand || '', rate: selected.purchase_price || selected.rate || '' };";
    const newStr1 = "newProducts[index] = { ...newProducts[index], item_id: selected.id, item: selected.name || selected.item_name, brand_id: selected.brand_id || null, brand: selected.brand || '', rate: selected.purchase_price || selected.rate || newProducts[index].rate || '' };";
    
    // In mouse click for item
    const oldStr2 = "newProducts[index] = { ...newProducts[index], item_id: suggestion.id, item: suggestion.name || suggestion.item_name, brand_id: suggestion.brand_id || null, brand: suggestion.brand || '', rate: suggestion.purchase_price || suggestion.rate || '' };";
    const newStr2 = "newProducts[index] = { ...newProducts[index], item_id: suggestion.id, item: suggestion.name || suggestion.item_name, brand_id: suggestion.brand_id || null, brand: suggestion.brand || '', rate: suggestion.purchase_price || suggestion.rate || newProducts[index].rate || '' };";

    // In handleImport filter
    const oldFilter = "}).filter(p => p.item || Number(p.qty) > 0);";
    const newFilter = "}).filter(p => (p.item && p.item.trim()) || Number(p.qty) > 0);";

    content = content.replace(oldStr1, newStr1).replace(oldStr2, newStr2).replace(oldFilter, newFilter);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched', filePath);
  }
}

patchFile('FrontEnd/src/pages/inventory/PurchaseInvoice.tsx');
patchFile('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx');
