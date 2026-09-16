const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const regex = /const updateProduct = \(index: number, field: string, value: any\) => \{\n    setProducts\(prev => \{\n      const newProducts = \[\.\.\.prev\];\n      newProducts\[index\] = \{ \.\.\.newProducts\[index\], \[field\]: value \};\n      return newProducts;\n    \}\);\n  \};/;

const replacement = `const updateProduct = (index: number, field: string, value: any) => {
    setProducts(prev => {
      const newProducts = [...prev];
      let p = { ...newProducts[index], [field]: value };
      
      // Auto-calculate Discount % if MRP Markdown is enabled
      if (invoiceData.showMarkdown && (field === 'rate' || field === 'mrp')) {
        const r = parseFloat(p.rate) || 0;
        const m = parseFloat(p.mrp) || 0;
        if (m > 0 && r > 0 && r <= m) {
          p.disc = parseFloat((((m - r) / m) * 100).toFixed(2));
        } else if (m > 0 && r === 0) {
          p.disc = 0;
        }
      }
      
      newProducts[index] = p;
      return newProducts;
    });
  };`;

piContent = piContent.replace(regex, replacement);

fs.writeFileSync(piFile, piContent);
console.log("Patched auto-disc!");
