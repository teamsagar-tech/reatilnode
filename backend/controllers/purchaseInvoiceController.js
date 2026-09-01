const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, v.name as vendor_name
      FROM PurchaseInvoices p
      LEFT JOIN Vendors v ON p.vendor_id = v.id
      WHERE p.firm_id = ?
      ORDER BY p.created_at DESC
    `, [req.firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching purchase invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getById = async (req, res) => {
  const conn = await db.getConnection();
  try {
    // 1. Get Header
    const [invoiceRows] = await conn.execute(`
      SELECT p.*, v.name as vendor_name
      FROM PurchaseInvoices p
      LEFT JOIN Vendors v ON p.vendor_id = v.id
      WHERE p.firm_id = ? AND p.id = ?
    `, [req.firm_id, req.params.id]);

    if (invoiceRows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const invoice = invoiceRows[0];

    // 2. Get Items
    const [items] = await conn.execute(`
      SELECT pi.*, i.name as item_name
      FROM PurchaseInvoiceItems pi
      LEFT JOIN Items i ON pi.item_id = i.id
      WHERE pi.invoice_id = ?
    `, [invoice.id]);

    // 3. Get Attributes for Items
    for (let item of items) {
      const [attributes] = await conn.execute(`
        SELECT pia.*, 
          s.name as size_name, 
          c.name as color_name, 
          d.name as design_name
        FROM PurchaseInvoiceItemAttributes pia
        LEFT JOIN Sizes s ON pia.size_id = s.id
        LEFT JOIN Colors c ON pia.color_id = c.id
        LEFT JOIN Designs d ON pia.design_id = d.id
        WHERE pia.invoice_item_id = ?
      `, [item.id]);
      item.attributes = attributes;
    }

    invoice.items = items;
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching purchase invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
};

// Helper to generate GRN dynamically
async function generateGRN(conn, firm_id) {
  // 1. Fetch Firm Settings
  const [firms] = await conn.execute('SELECT settings FROM Firms WHERE id = ?', [firm_id]);
  const settings = firms[0]?.settings || {};
  const template = settings.grn_template || 'GRN-{{SEQ}}'; // default template

  // 2. Fetch the latest GRN sequence for this firm
  const [latest] = await conn.execute(
    'SELECT grn_no FROM PurchaseInvoices WHERE firm_id = ? ORDER BY id DESC LIMIT 1', 
    [firm_id]
  );
  
  let nextSeq = 1;
  if (latest.length > 0 && latest[0].grn_no) {
    // Extract the numeric part at the end of the GRN
    const match = latest[0].grn_no.match(/(\d+)$/);
    if (match) {
      nextSeq = parseInt(match[1], 10) + 1;
    }
  }

  const seqStr = String(nextSeq).padStart(4, '0');
  
  // Replace tokens
  let grn = template.replace('{{SEQ}}', seqStr);
  
  // Add more dynamic logic like FY, MM, DD if needed by the template
  const date = new Date();
  grn = grn.replace('{{YYYY}}', date.getFullYear());
  grn = grn.replace('{{MM}}', String(date.getMonth() + 1).padStart(2, '0'));
  grn = grn.replace('{{DD}}', String(date.getDate()).padStart(2, '0'));

  return grn;
}

exports.create = async (req, res) => {
  const { vendor_id, bill_no, bill_date, receive_date, total_amount, gst_amount, net_amount, narration, items } = req.body;
  
  if (!vendor_id) return res.status(400).json({ error: 'Vendor is required' });
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'At least one item is required' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Generate GRN dynamically
    const grn_no = await generateGRN(conn, req.firm_id);
    const lr_status = 'LR PENDING';

    // 2. Insert Header
    const [invoiceResult] = await conn.execute(
      `INSERT INTO PurchaseInvoices 
       (firm_id, grn_no, vendor_id, bill_no, bill_date, receive_date, total_amount, gst_amount, net_amount, narration, lr_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.firm_id, grn_no, vendor_id, bill_no || null, bill_date || null, receive_date || null, total_amount || 0, gst_amount || 0, net_amount || 0, narration || null, lr_status]
    );
    const invoiceId = invoiceResult.insertId;

    // 2. Insert Items & Attributes
    for (let item of items) {
      const [itemResult] = await conn.execute(
        `INSERT INTO PurchaseInvoiceItems 
         (invoice_id, item_id, category_id, brand_id, purchase_rate, mrp, total_qty, gst_percent, gst_amount, total_amount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [invoiceId, item.item_id, item.category_id || null, item.brand_id || null, item.purchase_rate || 0, item.mrp || 0, item.total_qty || 0, item.gst_percent || 0, item.gst_amount || 0, item.total_amount || 0]
      );
      const itemId = itemResult.insertId;

      // 3. Insert Attributes Breakup (if any)
      if (item.attributes && Array.isArray(item.attributes) && item.attributes.length > 0) {
        for (let attr of item.attributes) {
          // generate a unique barcode here if not provided
          let barcode = attr.barcode || `${invoiceId}-${itemId}-${Date.now() % 100000}`;
          
          await conn.execute(
            `INSERT INTO PurchaseInvoiceItemAttributes 
             (invoice_item_id, size_id, color_id, design_id, qty, barcode) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [itemId, attr.size_id || null, attr.color_id || null, attr.design_id || null, attr.qty || 0, barcode]
          );
        }
      }
    }

    await conn.commit();
    res.status(201).json({ message: 'Purchase Invoice created successfully', id: invoiceId });
  } catch (error) {
    await conn.rollback();
    console.error('Error creating purchase invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
};

exports.delete = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    
    // Deleting the invoice will cascade and delete items & attributes if foreign keys have ON DELETE CASCADE
    // But we manually ensure it is from the correct firm
    const [result] = await conn.execute('DELETE FROM PurchaseInvoices WHERE id = ? AND firm_id = ?', [req.params.id, req.firm_id]);
    
    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await conn.commit();
    res.json({ message: 'Purchase Invoice deleted successfully' });
  } catch (error) {
    await conn.rollback();
    console.error('Error deleting purchase invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
};
