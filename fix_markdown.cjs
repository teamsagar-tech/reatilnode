const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldUpdateProduct = `  const updateProduct = (index: number, field: string, value: any) => {
    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = { ...newProducts[index], [field]: value };
      return newProducts;
    });
  };`;

const newUpdateProduct = `  const updateProduct = (index: number, field: string, value: any) => {
    setProducts(prev => {
      const newProducts = [...prev];
      const prod = { ...newProducts[index], [field]: value };
      
      // Auto-calculate Rate if MRP or Disc changes and MRP Markdown is checked
      if (invoiceData.showMarkdown && (field === 'mrp' || field === 'disc')) {
        const mrp = parseFloat(prod.mrp) || 0;
        const disc = parseFloat(prod.disc) || 0;
        if (mrp > 0) {
          prod.rate = (mrp * (1 - (disc / 100))).toFixed(2);
        }
      }
      
      newProducts[index] = prod;
      return newProducts;
    });
  };`;

content = content.replace(oldUpdateProduct, newUpdateProduct);

const oldToggle = `<input type="checkbox" checked={invoiceData.showMarkdown} onChange={e => setInvoiceData({...invoiceData, showMarkdown: e.target.checked})} className="accent-[#1b5e58]" /> MRP Markdown`;
const newToggle = `<input type="checkbox" checked={invoiceData.showMarkdown} onChange={e => {
  const isChecked = e.target.checked;
  setInvoiceData(prev => ({
    ...prev,
    showMarkdown: isChecked,
    ...(isChecked ? { showPurchaseDiscount: true } : {})
  }));
}} className="accent-[#1b5e58]" /> MRP Markdown`;

content = content.replace(oldToggle, newToggle);

fs.writeFileSync(file, content);
console.log("Fixed Markdown auto-check and rate auto-calc!");
