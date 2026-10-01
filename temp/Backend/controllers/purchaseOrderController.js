const db = require('../config/db');

exports.list = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.execute(`
      SELECT p.*, v.name as vendor_name
      FROM PurchaseOrders p
      LEFT JOIN Vendors v ON p.vendor_id = v.id
      WHERE p.firm_id = ?
      ORDER BY p.created_at DESC
    `, [req.firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
};

exports.getById = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const [poRows] = await conn.execute(`
      SELECT p.*, v.name as vendor_name
      FROM PurchaseOrders p
      LEFT JOIN Vendors v ON p.vendor_id = v.id
      WHERE p.firm_id = ? AND p.id = ?
    `, [req.firm_id, req.params.id]);

    if (poRows.length === 0) {
      return res.status(404).json({ error: 'Purchase Order not found' });
    }
    const po = poRows[0];

    const [items] = await conn.execute(`
      SELECT * FROM PurchaseOrderItems WHERE purchase_order_id = ?
    `, [po.id]);

    po.items = items;
    res.json(po);
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
};

exports.create = async (req, res) => {
  const { vendor_id, po_date, delivery_date, shipping_address, remark, items } = req.body;
  
  if (!vendor_id) return res.status(400).json({ error: 'Vendor is required' });
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'At least one item is required' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Generate PO Number
    const [counts] = await conn.query('SELECT COUNT(*) as count FROM PurchaseOrders WHERE firm_id = ?', [req.firm_id]);
    const nextId = counts[0].count + 1;
    const po_number = `PO-${Date.now().toString().slice(-4)}-${nextId}`;

    let total_quantity = 0;
    let total_amount = 0;
    
    for (let item of items) {
      total_quantity += Number(item.order_quantity || 0);
      total_amount += Number(item.total_amount || 0);
    }

    const [poResult] = await conn.execute(
      `INSERT INTO PurchaseOrders 
       (firm_id, po_number, po_date, vendor_id, total_quantity, total_amount, delivery_date, shipping_address, remark, created_by_user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.firm_id, po_number, po_date || new Date(), vendor_id, total_quantity, total_amount, delivery_date || null, shipping_address || null, remark || null, req.user?.id || null]
    );
    const poId = poResult.insertId;

    for (let item of items) {
      await conn.execute(
        `INSERT INTO PurchaseOrderItems 
         (firm_id, purchase_order_id, item_id, item_name, order_quantity, rate, tax_percent, total_amount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.firm_id, poId, item.item_id || null, item.item_name, item.order_quantity, item.rate || 0, item.tax_percent || 0, item.total_amount || 0]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Purchase Order created successfully', id: poId, po_number });
  } catch (error) {
    await conn.rollback();
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
};
