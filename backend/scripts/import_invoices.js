const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
const API_BASE = `http://localhost:${PORT}/api`;

// Generate a temporary Superadmin token for API access
const token = jwt.sign(
  { id: 1, firm_id: 1, role: 'Superadmin' }, 
  process.env.JWT_SECRET, 
  { expiresIn: '1h' }
);

const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${token}` }
});

async function findOrCreateVendor(vendorName) {
  try {
    const res = await api.get('/vendors');
    const vendors = res.data;
    const existing = vendors.find(v => (v.name || '').toLowerCase() === vendorName.toLowerCase());
    if (existing) return existing.id;
    
    console.log(`Creating new Vendor: ${vendorName}`);
    const createRes = await api.post('/vendors', {
      name: vendorName,
      type: 'Vendor',
      short_name: vendorName
    });
    return createRes.data.id;
  } catch (err) {
    console.error(`Error resolving vendor ${vendorName}:`, err.response?.data || err.message);
    throw err;
  }
}

async function findOrCreateItem(itemData) {
  try {
    const res = await api.get('/items');
    const existing = res.data.find(i => i.name.toLowerCase() === itemData.item.toLowerCase());
    if (existing) return existing.id;
    
    console.log(`Creating new Item: ${itemData.item}`);
    const createRes = await api.post('/items', {
      name: itemData.item,
      hsn_code: itemData.hsn || '',
      tax_percent: itemData.gst || 5,
      cost_price: itemData.rate,
      mrp: itemData.rate * 1.5 // approximate MRP
    });
    return createRes.data.id;
  } catch (err) {
    console.error(`Error resolving item ${itemData.item}:`, err.response?.data || err.message);
    throw err;
  }
}

async function runImport() {
  const dataPath = path.join(__dirname, '../../sample/invoices/raw_invoices.json');
  if (!fs.existsSync(dataPath)) {
    console.error("raw_invoices.json not found!");
    process.exit(1);
  }

  const invoices = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  for (let inv of invoices) {
    console.log(`\n=== Processing Invoice: ${inv.billNo} from ${inv.supplier} ===`);
    
    try {
      const vendorId = await findOrCreateVendor(inv.supplier);
      
      let itemsPayload = [];
      let totalTaxable = 0;
      let totalGst = 0;

      for (let item of inv.items) {
        const itemId = await findOrCreateItem(item);
        const rowAmount = Number(item.qty) * Number(item.rate);
        const rowGst = rowAmount * (Number(item.gst) / 100);
        
        itemsPayload.push({
          item_id: itemId,
          total_qty: item.qty,
          purchase_rate: item.rate,
          mrp: item.rate * 1.5,
          gst_percent: item.gst,
          gst_amount: rowGst,
          total_amount: rowAmount,
          attributes: [{ qty: item.qty }]
        });

        totalTaxable += rowAmount;
        totalGst += rowGst;
      }

      let netAmount = totalTaxable + totalGst - (inv.discountAmount || 0);

      const invoicePayload = {
        vendor_id: vendorId,
        bill_no: inv.billNo,
        bill_date: inv.billDate,
        receive_date: new Date().toISOString().split('T')[0],
        total_amount: totalTaxable,
        discount_percent: inv.discountPercent || 0,
        discount_amount: inv.discountAmount || 0,
        gst_amount: totalGst,
        net_amount: netAmount,
        transporter: inv.transporter || '',
        items: itemsPayload
      };

      console.log(`Submitting Invoice Payload...`);
      const invRes = await api.post('/purchase-invoices', invoicePayload);
      console.log(`Successfully created Purchase Invoice ID: ${invRes.data.id}`);

    } catch (err) {
      console.error(`Failed to import invoice ${inv.billNo}:`, err.response?.data || err.message);
    }
  }
}

runImport();
