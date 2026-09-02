const fs = require('fs');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // In handleKeyDown for item
    const oldStr1 = "gst: selected.tax_percent !== undefined ? selected.tax_percent : 0";
    const newStr1 = "gst: selected.tax_percent !== undefined ? selected.tax_percent : (newProducts[index].gst || 0)";
    
    // In mouse click for item
    const oldStr2 = "gst: suggestion.tax_percent !== undefined ? suggestion.tax_percent : 0";
    const newStr2 = "gst: suggestion.tax_percent !== undefined ? suggestion.tax_percent : (newProducts[index].gst || 0)";

    content = content.replace(oldStr1, newStr1).replace(oldStr2, newStr2);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched GST in', filePath);
  }
}

patchFile('FrontEnd/src/pages/inventory/PurchaseInvoice.tsx');
patchFile('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx');
