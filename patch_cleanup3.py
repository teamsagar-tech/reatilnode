import sys
with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'r') as f:
    content = f.read()

old_code = """  const cleanUpGrid = () => {
    setProducts(prev => {
      const cleaned = prev.filter(p => Number(p.qty) > 0);
      if (cleaned.length === 0) {
        return [{ id: Date.now(), item: '', hsn: '', brand: '', brand_id: null, qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0, disc2: 0, sale_rate: '', attributes: [], category: null }];
      }
      const last = cleaned[cleaned.length - 1];
      cleaned.push({
        id: Date.now(),
        item: '',
        hsn: '',
        brand: last.brand || '',
        brand_id: last.brand_id || null,
        qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: last.disc || 0, gst: 0, design: '', colour: '', size: '', mrp: 0, disc2: last.disc2 || 0, sale_rate: '', attributes: [], category: null
      });
      return cleaned;
    });
  };"""

new_code = """  const cleanUpGrid = () => {
    setProducts(prev => {
      const cleaned = prev.filter(p => Number(p.qty) > 0);
      if (cleaned.length === 0) {
        return [{ id: Date.now(), item: '', hsn: '', brand: '', brand_id: null, qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0, disc2: 0, sale_rate: '', attributes: [], category: null }];
      }
      return cleaned;
    });
  };"""

content = content.replace(old_code, new_code)

with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'w') as f:
    f.write(content)
