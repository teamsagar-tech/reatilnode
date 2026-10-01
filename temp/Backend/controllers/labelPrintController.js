const pool = require('../config/db');

exports.getPrintableBatch = async (req, res) => {
  try {
    const { batchId, autoprint, isVerticalLayout: verticalParam, firmId } = req.body || {};

    if (!batchId) return res.status(400).send('batchId is required');

    const isVerticalLayout = verticalParam !== false && verticalParam !== 'false';
    const effectiveFirmId = req.firm_id; // Using strict middleware firm_id

    const [products] = await pool.query(`
      SELECT p.*, 
             b.brand_name, 
             c.category_name, 
             s.size_name, 
             st.style_name, 
             co.color_name, 
             d.department_name
      FROM Products p
      LEFT JOIN Brands b ON p.brand_id = b.id
      LEFT JOIN Categories c ON p.category_id = c.id
      LEFT JOIN Sizes s ON p.size_id = s.id
      LEFT JOIN Styles st ON p.style_id = st.id
      LEFT JOIN Colors co ON p.color_id = co.id
      LEFT JOIN Departments d ON p.department_id = d.id
      WHERE p.firm_id = ? AND p.batch = ?
    `, [effectiveFirmId, String(batchId)]);

    if (products.length === 0) {
      return res.status(404).send('No products found for this batch');
    }

    // HTML layout generation would typically happen on the frontend now,
    // but if the legacy approach generated raw HTML from the backend, we should just return JSON
    // for the new React FrontEndV2 to render.
    
    // In RetailNodeV2, the frontend LabelPrintPage component handles rendering.
    res.json({ success: true, products, batchId, isVerticalLayout });
  } catch (err) {
    console.error('getPrintableBatch error:', err);
    return res.status(500).send('Internal server error');
  }
};

exports.getLabelPrintSettings = async (req, res) => {
  try {
    const effectiveFirmId = req.firm_id;
    const [settings] = await pool.query('SELECT * FROM LabelPrintSettings WHERE firm_id = ?', [effectiveFirmId]);
    
    if (settings.length > 0) {
      res.json({ success: true, data: settings[0] });
    } else {
      res.json({ success: true, data: { round: false, add_disc: false, lock_mrp: false, lock_sale_rate: false, is_multi_sequence: false } });
    }
  } catch (err) {
    console.error('getLabelPrintSettings error:', err);
    return res.status(500).send('Internal server error');
  }
};

exports.getInvoiceItemsByLR = async (req, res) => {
  try {
    const { lr_nos } = req.body;
    const effectiveFirmId = req.firm_id;
    
    if (!lr_nos || !Array.isArray(lr_nos) || lr_nos.length === 0) {
      return res.status(400).json({ success: false, message: 'lr_nos array is required' });
    }

    const placeholders = lr_nos.map(() => '?').join(',');
    
    // Fetch all items from InvoiceProducts that belong to the given LRs
    const [items] = await pool.query(`
      SELECT 
        ip.id as invoice_product_id,
        ip.invoice_id,
        i.name as item_name,
        ip.total_qty as invoiced_qty,
        ip.purchase_rate,
        ip.gst_percent as gst,
        i.selling_price as sale_rate,
        ip.mrp as mrp, 
        pi.lr_no,
        pi.grn_no as grn,
        pi.bill_date,
        v.name as party_name,
        ip.category_id,
        null as sub_category_id,
        null as department_id,
        null as material_id,
        null as colour,
        null as design,
        ip.size_group_id as size_id
      FROM PurchaseInvoiceItems ip
      JOIN PurchaseInvoices pi ON ip.invoice_id = pi.id
      JOIN Items i ON ip.item_id = i.id
      LEFT JOIN Vendors v ON pi.vendor_id = v.id
      WHERE pi.firm_id = ? AND pi.lr_no IN (${placeholders})
    `, [effectiveFirmId, ...lr_nos]);

    // We also map total_amount or net_rate just as fallbacks, but the frontend will let users set VRP/MRP

    res.json({ success: true, data: items });
  } catch (error) {
    console.error('getInvoiceItemsByLR error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.generateBarcodes = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { products } = req.body;
    const effectiveFirmId = req.firm_id;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Products array is required' });
    }

    await connection.beginTransaction();

    const generatedProducts = [];

    for (const p of products) {
      const qtyToGenerate = parseInt(p.recv_qty) || 1;
      
      // Update PurchaseInvoiceItems with the assigned attributes (optional but good for history)
      await connection.query(`
        UPDATE PurchaseInvoiceItems 
        SET category_id=?,
            purchase_rate=?, total_amount=?
        WHERE id=?
      `, [
        p.category_id || null, 
        p.purchase_rate || 0,
        p.mrp || 0, // treating total_amount as mrp
        p.invoice_product_id
      ]);

      // Generate barcode sequences
      for (let i = 0; i < qtyToGenerate; i++) {
        // Simple barcode generation logic (in real world might be sequence table)
        // using Date.now() + random just as a placeholder for a unique barcode, or you can implement a standard sequence
        const uniqueSequence = Math.floor(1000000 + Math.random() * 9000000); // 7 digit
        const barcodeStr = uniqueSequence.toString();
        
        const [result] = await connection.query(`
          INSERT INTO Products (
            firm_id, invoice_id, invoice_product_id,
            barcode, batch, product_name, 
            category_id, sub_category_id, department_id, material_id, color_id, size_id,
            style_id, sub_style_id,
            purchase_rate, vrp_rate, mrp, discount, gst, quantity, current_stock, is_sold
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          effectiveFirmId, p.invoice_id, p.invoice_product_id,
          barcodeStr, p.grn || 'BATCH01', p.item_name,
          p.category_id || null, p.sub_category_id || null, p.department_id || null, p.material_id || null, p.color_id || null, p.size_id || null,
          p.style_id || null, p.sub_style_id || null,
          p.purchase_rate || 0, p.vrp || 0, p.mrp || 0, p.disc_percent || 0, p.gst || 0, 1, 1, 0
        ]);
        
        generatedProducts.push({
          id: result.insertId,
          barcode: barcodeStr,
          product_name: p.item_name,
          category_id: p.category_id,
          date: p.bill_date,
          grn: p.grn,
          purchase_rate: p.purchase_rate,
          mrp: p.mrp,
          sale_rate: p.vrp,
          qty: 1,
          stock: 1
        });
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'Barcodes generated successfully', data: generatedProducts });
  } catch (error) {
    await connection.rollback();
    console.error('generateBarcodes error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
};

exports.getGeneratedBarcodes = async (req, res) => {
  try {
    const { invoice_product_id } = req.params;
    const effectiveFirmId = req.firm_id;
    
    if (!invoice_product_id) return res.status(400).json({ success: false, message: 'invoice_product_id is required' });

    const [products] = await pool.query(`
      SELECT p.id, p.barcode, p.product_name as item_name, c.category_name as category,
             p.created_at as date, p.batch as grn, p.purchase_rate, p.mrp, p.vrp_rate as sale_rate,
             p.quantity as qty, p.current_stock as stock
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      WHERE p.firm_id = ? AND p.invoice_product_id = ?
    `, [effectiveFirmId, invoice_product_id]);

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('getGeneratedBarcodes error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

