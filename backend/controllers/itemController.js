const db = require('../config/db');
// Mock maskData if not perfectly defined yet for items
const mockMaskData = (data, module, role) => {
  // If not admin, mask cost_price
  if (role !== 'admin' && role !== 'superadmin') {
    if (Array.isArray(data)) {
      return data.map(item => {
        const { cost_price, ...rest } = item;
        return { ...rest, cost_price: '***MASKED***' };
      });
    } else {
      const { cost_price, ...rest } = data;
      return { ...rest, cost_price: '***MASKED***' };
    }
  }
  return data;
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Items WHERE firm_id = ?', [req.firm_id]);
    const masked = mockMaskData(rows, 'inventory', req.user.role);
    res.json(masked);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Items WHERE firm_id = ? AND id = ?', [req.firm_id, req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    const masked = mockMaskData(rows[0], 'inventory', req.user.role);
    res.json(masked);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  const { name, sku, barcode, category_id, brand_id, hsn_code, tax_percent, cost_price, selling_price, mrp, batch_tracking, min_stock_level } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const [result] = await db.execute(
      `INSERT INTO Items (firm_id, name, sku, barcode, category_id, brand_id, hsn_code, tax_percent, cost_price, selling_price, mrp, batch_tracking, min_stock_level) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.firm_id, name, sku || null, barcode || null, category_id || null, brand_id || null, hsn_code || null, tax_percent || 0, cost_price || 0, selling_price || 0, mrp || 0, batch_tracking || false, min_stock_level || 0]
    );
    res.status(201).json({ message: 'Item created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  const { name, sku, barcode, category_id, brand_id, hsn_code, tax_percent, cost_price, selling_price, mrp, batch_tracking, min_stock_level } = req.body;
  try {
    const [result] = await db.execute(
      `UPDATE Items SET name=?, sku=?, barcode=?, category_id=?, brand_id=?, hsn_code=?, tax_percent=?, cost_price=?, selling_price=?, mrp=?, batch_tracking=?, min_stock_level=? 
       WHERE id=? AND firm_id=?`,
      [name, sku || null, barcode || null, category_id || null, brand_id || null, hsn_code || null, tax_percent || 0, cost_price || 0, selling_price || 0, mrp || 0, batch_tracking || false, min_stock_level || 0, req.params.id, req.firm_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Items WHERE id=? AND firm_id=?', [req.params.id, req.firm_id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
