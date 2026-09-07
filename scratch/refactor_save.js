const fs = require('fs');
let content = fs.readFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'utf8');

const saveStart = content.indexOf(`  const handleSaveInvoice = () => {
    alert('Purchase Invoice Saved Successfully!');
    if (importQueue.length > 0) {
      loadNextInQueue();
    }
  };`);

const newSave = `  const handleSaveInvoice = async () => {
    if (!invoiceData.supplier) {
      alert('Party is required');
      return;
    }
    
    const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === (invoiceData.supplier || '').toLowerCase());
    if (!matchedVendor) {
      alert('Invalid Party selected. Please ensure the Party exists.');
      return;
    }

    const payload = {
      vendor_id: matchedVendor.id,
      bill_no: invoiceData.billNo,
      bill_date: invoiceData.billDate || null,
      receive_date: invoiceData.receiveDate || null,
      total_amount: Number(invoiceData.billAmount) || 0,
      gst_amount: 0,
      net_amount: Number(invoiceData.billAmount) || 0,
      narration: invoiceData.narration || '',
      items: products.filter((p: any) => p.item_id).map((p: any) => ({
        item_id: p.item_id,
        category_id: null,
        brand_id: p.brand_id || null,
        purchase_rate: Number(p.rate) || 0,
        mrp: Number(p.mrp) || 0,
        total_qty: Number(p.qty) || 0,
        gst_percent: Number(p.gst) || 0,
        gst_amount: 0,
        total_amount: (Number(p.rate) * Number(p.qty)) || 0,
        attributes: p.attributes || []
      }))
    };

    if (payload.items.length === 0) {
      alert('At least one valid item is required to save.');
      return;
    }

    try {
      const res = await fetch('https://api.retailnode.in/api/purchase-invoices', {
        method: 'POST',
        headers: { 
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save invoice');
      }

      alert('Purchase Invoice Saved Successfully!');
      if (importQueue.length > 0) {
        loadNextInQueue();
      } else {
        // Clear form if no queue
        setInvoiceData({
            supplier: '', billNo: '', billDate: '', receiveDate: new Date().toISOString().split('T')[0],
            totalQuantity: '', billAmount: '', showLocation: false,
            designNo: false, colourNo: false, showSize: false, showPurchaseDiscount: false, showMarkdown: false,
            poNo: '', orderBy: '', transporter: '', lrNo: '', bale: '', narration: '',
            discountPercent: 0, discountAmount: 0, commissionPercent: 0, 
            cgstPercent: 'Auto', sgstPercent: 'Auto', otherCharges: 0, purchaser: ''
        });
        setProducts([{ id: Date.now(), item_id: null, item: '', hsn: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }]);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred while saving the invoice.');
    }
  };`;

content = content.replace(`  const handleSaveInvoice = () => {
    alert('Purchase Invoice Saved Successfully!');
    if (importQueue.length > 0) {
      loadNextInQueue();
    }
  };`, newSave);

fs.writeFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', content);
console.log("Replaced handleSaveInvoice");
