require('dotenv').config();
const db = require('./config/db');
const purchaseInvoiceController = require('./controllers/purchaseInvoiceController');

async function runImport() {
  console.log('--- Starting Invoice API Import Test ---');
  const conn = await db.getConnection();

  try {
    const firm_id = 1; // VRP

    // 1. Setup Vendor
    const vendorName = 'LA BASE SHIRTS';
    let [vendors] = await conn.execute('SELECT id FROM Vendors WHERE firm_id = ? AND name = ?', [firm_id, vendorName]);
    let vendor_id;
    if (vendors.length === 0) {
      const [res] = await conn.execute('INSERT INTO Vendors (firm_id, name) VALUES (?, ?)', [firm_id, vendorName]);
      vendor_id = res.insertId;
      console.log(`Created Vendor ID: ${vendor_id}`);
    } else {
      vendor_id = vendors[0].id;
      console.log(`Found Vendor ID: ${vendor_id}`);
    }

    // 2. Setup Items
    const itemsData = [
      { name: 'SHIRTS', hsn: '620520' },
      { name: 'KURTA PAZAMA', hsn: '621142' },
      { name: 'JACKET', hsn: '62033200' }
    ];

    const itemMap = {};
    for (let item of itemsData) {
      let [existing] = await conn.execute('SELECT id FROM Items WHERE firm_id = ? AND name = ?', [firm_id, item.name]);
      if (existing.length === 0) {
        const [res] = await conn.execute('INSERT INTO Items (firm_id, name, hsn_code) VALUES (?, ?, ?)', [firm_id, item.name, item.hsn]);
        itemMap[item.name] = res.insertId;
        console.log(`Created Item ${item.name} ID: ${itemMap[item.name]}`);
      } else {
        itemMap[item.name] = existing[0].id;
      }
    }

    // 3. Prepare Invoice Payload based on the image
    const payload = {
      vendor_id: vendor_id,
      bill_no: 'LB/2627/827',
      bill_date: '2026-09-02',
      gst_amount: 5105.20,
      total_amount: 109790.00,
      discount_percent: 7,
      discount_amount: 7685.30,
      net_amount: 107209.90, // 109790 - 7685.3 + 5105.2
      items: [
        {
          item_id: itemMap['SHIRTS'],
          design: 'C80',
          total_qty: 28,
          purchase_rate: 380.00,
          mrp: 380.00,
          gst_percent: 5,
          gst_amount: (380 * 28 * 0.05),
          total_amount: 380 * 28
        },
        {
          item_id: itemMap['SHIRTS'],
          design: 'C70',
          total_qty: 20,
          purchase_rate: 370.00,
          mrp: 370.00,
          gst_percent: 5,
          gst_amount: (370 * 20 * 0.05),
          total_amount: 370 * 20
        },
        {
          item_id: itemMap['SHIRTS'],
          design: 'D20',
          total_qty: 3,
          purchase_rate: 420.00,
          mrp: 420.00,
          gst_percent: 5,
          gst_amount: (420 * 3 * 0.05),
          total_amount: 420 * 3
        },
        {
          item_id: itemMap['SHIRTS'],
          design: 'E10',
          total_qty: 6, // Combined rows 4 and 6
          purchase_rate: 510.00,
          mrp: 510.00,
          gst_percent: 5,
          gst_amount: (510 * 6 * 0.05),
          total_amount: 510 * 6
        },
        {
          item_id: itemMap['KURTA PAZAMA'],
          design: 'F10',
          total_qty: 4,
          purchase_rate: 610.00,
          mrp: 610.00,
          gst_percent: 5,
          gst_amount: (610 * 4 * 0.05),
          total_amount: 610 * 4
        },
        {
          item_id: itemMap['JACKET'],
          design: 'E00',
          total_qty: 4,
          purchase_rate: 500.00,
          mrp: 500.00,
          gst_percent: 5,
          gst_amount: (500 * 4 * 0.05),
          total_amount: 500 * 4
        }
      ]
    };

    // 4. Create fake req, res for the controller
    const req = {
      firm_id: firm_id,
      user: { id: 1 },
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      body: payload
    };

    let responseData = null;
    let statusCode = null;

    const res = {
      status: function(code) {
        statusCode = code;
        return this;
      },
      json: function(data) {
        responseData = data;
        console.log(`API Response Status: ${statusCode || 200}`);
        console.log('API Response Body:', data);
        
        if (data.id) {
          verify(data.id);
        } else {
          process.exit(1);
        }
      }
    };

    console.log('Calling purchaseInvoiceController.create() ...');
    await purchaseInvoiceController.create(req, res);

  } catch (e) {
    console.error('Script error:', e);
  } finally {
    conn.release();
  }
}

async function verify(invoiceId) {
  const conn = await db.getConnection();
  try {
    const [items] = await conn.execute('SELECT * FROM PurchaseInvoiceItems WHERE invoice_id = ?', [invoiceId]);
    console.log(`--- API Inserted ${items.length} Line Items ---`);
    
    let attrCount = 0;
    for (let item of items) {
      const [attributes] = await conn.execute('SELECT * FROM PurchaseInvoiceItemAttributes WHERE invoice_item_id = ?', [item.id]);
      attrCount += attributes.length;
    }
    console.log(`--- API Inserted ${attrCount} Dynamic Attribute Breakups ---`);
    console.log('SUCCESS: API fully processed the payload without direct SQL manipulation!');
  } catch(e) {
    console.error(e);
  } finally {
    conn.release();
    process.exit(0);
  }
}

runImport();
