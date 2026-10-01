require('dotenv').config();
const db = require('./config/db');
const purchaseInvoiceController = require('./controllers/purchaseInvoiceController');

async function runImport() {
  console.log('--- Starting PANKHUDI Invoice API Import Test ---');
  const conn = await db.getConnection();

  try {
    const firm_id = 1; // VRP

    // Delete previously inserted test invoice if any
    await conn.execute("DELETE FROM PurchaseInvoices WHERE bill_no = '2809/26-27'");

    // 1. Setup Vendor
    const vendorName = 'PANKHUDI';
    let [vendors] = await conn.execute('SELECT id FROM Vendors WHERE firm_id = ? AND name = ?', [firm_id, vendorName]);
    let vendor_id = vendors.length ? vendors[0].id : (await conn.execute('INSERT INTO Vendors (firm_id, name) VALUES (?, ?)', [firm_id, vendorName]))[0].insertId;

    // 2. Setup Brand
    let [brands] = await conn.execute('SELECT id FROM Brands WHERE firm_id = ? AND name = ?', [firm_id, vendorName]);
    let brand_id = brands.length ? brands[0].id : (await conn.execute('INSERT INTO Brands (firm_id, name) VALUES (?, ?)', [firm_id, vendorName]))[0].insertId;

    // 3. Setup Transporter
    const transName = 'SHOLAPUR GOODS TR';
    let [transporters] = await conn.execute('SELECT id FROM Transporters WHERE firm_id = ? AND name = ?', [firm_id, transName]);
    let transporter_id = transporters.length ? transporters[0].id : (await conn.execute('INSERT INTO Transporters (firm_id, name) VALUES (?, ?)', [firm_id, transName]))[0].insertId;

    // 4. Setup Items
    const ensureItem = async (name, hsn) => {
      let [existing] = await conn.execute('SELECT id FROM Items WHERE firm_id = ? AND name = ?', [firm_id, name]);
      return existing.length ? existing[0].id : (await conn.execute('INSERT INTO Items (firm_id, name, hsn_code) VALUES (?, ?, ?)', [firm_id, name, hsn]))[0].insertId;
    };
    
    const itemIdSkirt = await ensureItem('SKIRT TOP', '620413');
    const itemIdGhagra = await ensureItem('GHAGRA CHOLI', '620413');
    const itemIdPlazo = await ensureItem('PLAZO', '620413');

    const ensureStyle = async (name) => {
      let [existing] = await conn.execute('SELECT id FROM Styles WHERE firm_id = ? AND name = ?', [firm_id, name]);
      return existing.length ? existing[0].id : (await conn.execute('INSERT INTO Styles (firm_id, name) VALUES (?, ?)', [firm_id, name]))[0].insertId;
    };

    const ensureSize = async (name) => {
      let [existing] = await conn.execute('SELECT id FROM Sizes WHERE firm_id = ? AND name = ?', [firm_id, name]);
      return existing.length ? existing[0].id : (await conn.execute('INSERT INTO Sizes (firm_id, name) VALUES (?, ?)', [firm_id, name]))[0].insertId;
    };

    const itemsData = [
      { item_id: itemIdSkirt, brand_id, design: '1625', size: '18 x 24', total_qty: 4, purchase_rate: 995, gst_percent: 5 },
      { item_id: itemIdSkirt, brand_id, design: '1626', size: '18 x 24', total_qty: 4, purchase_rate: 995, gst_percent: 5 },
      { item_id: itemIdSkirt, brand_id, design: '1628', size: '18 x 24', total_qty: 4, purchase_rate: 995, gst_percent: 5 },
      { item_id: itemIdSkirt, brand_id, design: '1630', size: '18 x 24', total_qty: 4, purchase_rate: 995, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2569*', size: '24 x 38', total_qty: 8, purchase_rate: 1595, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2569*', size: '24 x 38', total_qty: 8, purchase_rate: 1595, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2617', size: '16 x 22', total_qty: 4, purchase_rate: 1395, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2617', size: '16 x 22', total_qty: 4, purchase_rate: 1395, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2654', size: '24 x 38', total_qty: 8, purchase_rate: 1395, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2654*', size: '16 x 22', total_qty: 4, purchase_rate: 1395, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2679', size: '24 x 38', total_qty: 8, purchase_rate: 1695, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2679*', size: '18 x 24', total_qty: 4, purchase_rate: 1195, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2700', size: '16 x 22', total_qty: 4, purchase_rate: 1195, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2705', size: '16 x 22', total_qty: 4, purchase_rate: 1195, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2705', size: '24 x 38', total_qty: 8, purchase_rate: 1695, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2708*', size: '24 x 38', total_qty: 8, purchase_rate: 1695, gst_percent: 5 },
      { item_id: itemIdGhagra, brand_id, design: '2711*', size: '24 x 38', total_qty: 8, purchase_rate: 1445, gst_percent: 5 },
      { item_id: itemIdPlazo, brand_id, design: '3601*', size: '24 x 38', total_qty: 8, purchase_rate: 1395, gst_percent: 5 },
      { item_id: itemIdPlazo, brand_id, design: '3672*', size: '24 x 38', total_qty: 8, purchase_rate: 1465, gst_percent: 5 },
    ];

    const mappedItems = [];
    for (const item of itemsData) {
      const design_id = await ensureStyle(item.design);
      const size_id = await ensureSize(item.size);
      
      const amount = item.total_qty * item.purchase_rate;
      const gst = amount * (item.gst_percent / 100);
      
      mappedItems.push({
        ...item,
        mrp: item.purchase_rate,
        gst_amount: gst,
        total_amount: amount,
        attributes: [
          {
            qty: item.total_qty,
            design_id,
            size_id
          }
        ]
      });
    }

    const total_amount = mappedItems.reduce((sum, item) => sum + item.total_amount, 0);
    const gst_amount = mappedItems.reduce((sum, item) => sum + item.gst_amount, 0);
    const net_amount = total_amount + gst_amount;

    const payload = {
      vendor_id,
      bill_no: '2809/26-27',
      bill_date: '2026-08-10',
      total_amount,
      gst_amount,
      net_amount,
      transporter: transName,
      bales: 3,
      items: mappedItems
    };

    const req = {
      firm_id: firm_id,
      user: { id: 1 },
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      body: payload
    };

    const res = {
      status: (code) => res,
      json: (data) => {
        console.log('API Response:', data);
        if (data.id) {
          console.log('SUCCESS: Fully imported invoice! ID:', data.id);
          process.exit(0);
        } else {
          process.exit(1);
        }
      }
    };

    await purchaseInvoiceController.create(req, res);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    conn.release();
  }
}
runImport();
