require('dotenv').config();
const db = require('./config/db');
const purchaseInvoiceController = require('./controllers/purchaseInvoiceController');

async function runTest() {
  console.log('--- Starting Dry Run Test ---');
  
  // 1. Create fake req, res
  const req = {
    firm_id: 1, // Assuming 1 exists
    headers: {},
    socket: { remoteAddress: '127.0.0.1' },
    user: { id: 1 },
    body: {
      vendor_id: 1, // Assuming vendor 1 exists
      bill_no: 'TEST-DRY-RUN-001',
      total_amount: 1000,
      gst_amount: 50,
      net_amount: 1050,
      items: [
        {
          item_id: 1, // Assuming item 1 exists
          total_qty: 10,
          purchase_rate: 100,
          gst_percent: 5,
          gst_amount: 50,
          mrp: 150,
          design: 'TEST-DESIGN',
          colour: 'TEST-COLOUR',
          size: 'TEST-SIZE'
        }
      ]
    }
  };

  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      console.log(`Response Status: ${this.statusCode}`);
      console.log('Response Body:', data);
      
      // Let's verify DB
      if (data.id) {
        verifyDB(data.id);
      } else {
        process.exit(1);
      }
    }
  };

  // Pre-requisites: Insert test Styles, Colors, Sizes
  const conn = await db.getConnection();
  try {
    await conn.execute('INSERT IGNORE INTO Styles (firm_id, name) VALUES (1, "TEST-DESIGN")');
    await conn.execute('INSERT IGNORE INTO Colors (firm_id, name) VALUES (1, "TEST-COLOUR")');
    await conn.execute('INSERT IGNORE INTO Sizes (firm_id, name) VALUES (1, "TEST-SIZE")');
  } catch(e) {
    console.error('Error setting up test data:', e);
  } finally {
    conn.release();
  }

  // Execute Controller
  await purchaseInvoiceController.create(req, res);
}

async function verifyDB(invoiceId) {
  const conn = await db.getConnection();
  try {
    const [items] = await conn.execute('SELECT * FROM PurchaseInvoiceItems WHERE invoice_id = ?', [invoiceId]);
    console.log('--- Inserted Items ---');
    console.log(items);

    if (items.length > 0) {
      const itemId = items[0].id;
      const [attributes] = await conn.execute('SELECT * FROM PurchaseInvoiceItemAttributes WHERE invoice_item_id = ?', [itemId]);
      console.log('--- Inserted Attributes (This validates our fix) ---');
      console.log(attributes);
    }
    
    // Clean up
    console.log('--- Cleaning up test data ---');
    await conn.execute('DELETE FROM PurchaseInvoices WHERE id = ?', [invoiceId]);
    await conn.execute('DELETE FROM Styles WHERE name = "TEST-DESIGN"');
    await conn.execute('DELETE FROM Colors WHERE name = "TEST-COLOUR"');
    await conn.execute('DELETE FROM Sizes WHERE name = "TEST-SIZE"');
    
  } catch(e) {
    console.error('Verification error:', e);
  } finally {
    conn.release();
    process.exit(0);
  }
}

runTest();
