require('dotenv').config();
const db = require('./config/db');
const purchaseInvoiceController = require('./controllers/purchaseInvoiceController');

async function runImport() {
  console.log('--- Starting FULL Invoice API Import Test ---');
  const conn = await db.getConnection();

  try {
    const firm_id = 1; // VRP

    // 0. Clean up old test invoice (Invoice ID 12)
    await conn.execute('DELETE FROM PurchaseInvoices WHERE id = 12');
    console.log('Cleaned up previous test invoice.');

    // 1. Setup Vendor
    const vendorName = 'LA BASE SHIRTS';
    let [vendors] = await conn.execute('SELECT id FROM Vendors WHERE firm_id = ? AND name = ?', [firm_id, vendorName]);
    let vendor_id = vendors.length ? vendors[0].id : (await conn.execute('INSERT INTO Vendors (firm_id, name) VALUES (?, ?)', [firm_id, vendorName]))[0].insertId;

    // 2. Setup Brand
    let [brands] = await conn.execute('SELECT id FROM Brands WHERE firm_id = ? AND name = ?', [firm_id, vendorName]);
    let brand_id = brands.length ? brands[0].id : (await conn.execute('INSERT INTO Brands (firm_id, name) VALUES (?, ?)', [firm_id, vendorName]))[0].insertId;

    // 3. Setup Transporter
    const transName = 'VRL';
    let [transporters] = await conn.execute('SELECT id FROM Transporters WHERE firm_id = ? AND name = ?', [firm_id, transName]);
    let transporter_id = transporters.length ? transporters[0].id : (await conn.execute('INSERT INTO Transporters (firm_id, name) VALUES (?, ?)', [firm_id, transName]))[0].insertId;

    // 4. Setup Items and Styles
    const ensureItem = async (name, hsn) => {
      let [existing] = await conn.execute('SELECT id FROM Items WHERE firm_id = ? AND name = ?', [firm_id, name]);
      return existing.length ? existing[0].id : (await conn.execute('INSERT INTO Items (firm_id, name, hsn_code) VALUES (?, ?, ?)', [firm_id, name, hsn]))[0].insertId;
    };
    const ensureStyle = async (name) => {
      let [existing] = await conn.execute('SELECT id FROM Styles WHERE firm_id = ? AND name = ?', [firm_id, name]);
      return existing.length ? existing[0].id : (await conn.execute('INSERT INTO Styles (firm_id, name) VALUES (?, ?)', [firm_id, name]))[0].insertId;
    };

    const itemIdShirts = await ensureItem('SHIRTS', '620520');
    const itemIdKurta = await ensureItem('KURTA PAZAMA', '621142');
    const itemIdJacket = await ensureItem('JACKET', '62033200');

    // Make sure styles exist
    const stylesToCreate = ['C80', 'C70', 'D20', 'E10', 'E20', 'D90', 'F10', 'F00', 'E50', 'E60', 'H00', 'E00', 'G00'];
    for (let style of stylesToCreate) await ensureStyle(style);

    // 5. Full Payload
    const payload = {
      vendor_id,
      bill_no: 'LB/2627/827',
      bill_date: '2026-09-02',
      gst_amount: 5105.20,
      total_amount: 109790.00,
      discount_percent: 7,
      discount_amount: 7685.30,
      net_amount: 107209.90,
      lr_no: '672174798863',
      transporter: transName,
      bales: 3,
      items: [
        { item_id: itemIdShirts, brand_id, design: 'C80', total_qty: 28, purchase_rate: 380, mrp: 380, gst_percent: 5, gst_amount: (380 * 28 * 0.05), total_amount: 380 * 28 },
        { item_id: itemIdShirts, brand_id, design: 'C70', total_qty: 20, purchase_rate: 370, mrp: 370, gst_percent: 5, gst_amount: (370 * 20 * 0.05), total_amount: 370 * 20 },
        { item_id: itemIdShirts, brand_id, design: 'D20', total_qty: 3, purchase_rate: 420, mrp: 420, gst_percent: 5, gst_amount: (420 * 3 * 0.05), total_amount: 420 * 3 },
        { item_id: itemIdShirts, brand_id, design: 'E10', total_qty: 3, purchase_rate: 510, mrp: 510, gst_percent: 5, gst_amount: (510 * 3 * 0.05), total_amount: 510 * 3 },
        { item_id: itemIdShirts, brand_id, design: 'E20', total_qty: 12, purchase_rate: 520, mrp: 520, gst_percent: 5, gst_amount: (520 * 12 * 0.05), total_amount: 520 * 12 },
        { item_id: itemIdShirts, brand_id, design: 'E10', total_qty: 3, purchase_rate: 510, mrp: 510, gst_percent: 5, gst_amount: (510 * 3 * 0.05), total_amount: 510 * 3 },
        { item_id: itemIdShirts, brand_id, design: 'D90', total_qty: 27, purchase_rate: 490, mrp: 490, gst_percent: 5, gst_amount: (490 * 27 * 0.05), total_amount: 490 * 27 },
        { item_id: itemIdKurta, brand_id, design: 'F10', total_qty: 4, purchase_rate: 610, mrp: 610, gst_percent: 5, gst_amount: (610 * 4 * 0.05), total_amount: 610 * 4 },
        { item_id: itemIdKurta, brand_id, design: 'F00', total_qty: 4, purchase_rate: 600, mrp: 600, gst_percent: 5, gst_amount: (600 * 4 * 0.05), total_amount: 600 * 4 },
        { item_id: itemIdKurta, brand_id, design: 'E50', total_qty: 12, purchase_rate: 550, mrp: 550, gst_percent: 5, gst_amount: (550 * 12 * 0.05), total_amount: 550 * 12 },
        { item_id: itemIdKurta, brand_id, design: 'E60', total_qty: 4, purchase_rate: 560, mrp: 560, gst_percent: 5, gst_amount: (560 * 4 * 0.05), total_amount: 560 * 4 },
        { item_id: itemIdKurta, brand_id, design: 'H00', total_qty: 12, purchase_rate: 800, mrp: 800, gst_percent: 5, gst_amount: (800 * 12 * 0.05), total_amount: 800 * 12 },
        { item_id: itemIdJacket, brand_id, design: 'E00', total_qty: 4, purchase_rate: 500, mrp: 500, gst_percent: 5, gst_amount: (500 * 4 * 0.05), total_amount: 500 * 4 },
        { item_id: itemIdJacket, brand_id, design: 'D20', total_qty: 12, purchase_rate: 420, mrp: 420, gst_percent: 5, gst_amount: (420 * 12 * 0.05), total_amount: 420 * 12 },
        { item_id: itemIdJacket, brand_id, design: 'E50', total_qty: 8, purchase_rate: 550, mrp: 550, gst_percent: 5, gst_amount: (550 * 8 * 0.05), total_amount: 550 * 8 },
        { item_id: itemIdJacket, brand_id, design: 'E20', total_qty: 20, purchase_rate: 520, mrp: 520, gst_percent: 5, gst_amount: (520 * 20 * 0.05), total_amount: 520 * 20 },
        { item_id: itemIdJacket, brand_id, design: 'G00', total_qty: 8, purchase_rate: 700, mrp: 700, gst_percent: 5, gst_amount: (700 * 8 * 0.05), total_amount: 700 * 8 },
        { item_id: itemIdJacket, brand_id, design: 'E50', total_qty: 12, purchase_rate: 550, mrp: 550, gst_percent: 5, gst_amount: (550 * 12 * 0.05), total_amount: 550 * 12 },
        { item_id: itemIdJacket, brand_id, design: 'C80', total_qty: 28, purchase_rate: 380, mrp: 380, gst_percent: 5, gst_amount: (380 * 28 * 0.05), total_amount: 380 * 28 },
      ]
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
          console.log('SUCCESS: Fully imported invoice!');
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
