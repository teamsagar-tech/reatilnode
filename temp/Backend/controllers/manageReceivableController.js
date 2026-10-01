const { pool } = require('../config/db');

exports.searchReceivables = async (req, res) => {
  try {
    const { query } = req.query; // Could be barcode, batch, or invoice no
    const effectiveFirmId = req.firm_id;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const searchQuery = `%${query}%`;
    const [products] = await pool.query(`
      SELECT p.id, p.barcode, p.batch, p.product_name, p.quantity, p.vrp_rate, p.mrp, p.is_sold,
             i.bill_no, i.grn
      FROM Products p
      LEFT JOIN PurchaseInvoices i ON p.invoice_id = i.id
      WHERE p.firm_id = ? AND (p.barcode LIKE ? OR p.batch LIKE ? OR i.bill_no LIKE ?)
      ORDER BY p.id DESC
      LIMIT 100
    `, [effectiveFirmId, searchQuery, searchQuery, searchQuery]);

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('searchReceivables error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBatchProducts = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { productIds, updates } = req.body;
    const effectiveFirmId = req.firm_id;

    if (!productIds || productIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No products selected' });
    }

    await connection.beginTransaction();

    const placeholders = productIds.map(() => '?').join(',');
    const params = [
      updates.vrp_rate, updates.mrp, updates.discount,
      effectiveFirmId, ...productIds
    ];

    await connection.query(`
      UPDATE Products 
      SET vrp_rate = ?, mrp = ?, discount = ?
      WHERE firm_id = ? AND id IN (${placeholders})
    `, params);

    await connection.commit();
    res.json({ success: true, message: 'Products updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('updateBatchProducts error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

exports.splitProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { productId, numPieces } = req.body;
    const effectiveFirmId = req.firm_id;

    if (!productId || numPieces < 2) {
      return res.status(400).json({ success: false, message: 'Invalid split parameters' });
    }

    await connection.beginTransaction();

    // Fetch the original product
    const [products] = await connection.query('SELECT * FROM Products WHERE id = ? AND firm_id = ?', [productId, effectiveFirmId]);
    if (products.length === 0) {
      throw new Error('Product not found');
    }

    const originalProduct = products[0];

    // Create the new split pieces
    for (let i = 0; i < numPieces; i++) {
      const newBarcode = `${originalProduct.barcode}-${i+1}`;
      
      const insertKeys = Object.keys(originalProduct).filter(k => k !== 'id' && k !== 'created_at' && k !== 'updated_at' && k !== 'barcode');
      const insertValues = insertKeys.map(k => originalProduct[k]);
      
      insertKeys.push('barcode');
      insertValues.push(newBarcode);

      const placeholders = insertValues.map(() => '?').join(',');
      await connection.query(`
        INSERT INTO Products (${insertKeys.join(',')}) VALUES (${placeholders})
      `, insertValues);
    }

    // Delete or mark the original as inactive
    await connection.query('DELETE FROM Products WHERE id = ?', [productId]);

    await connection.commit();
    res.json({ success: true, message: `Product split into ${numPieces} pieces successfully` });
  } catch (error) {
    await connection.rollback();
    console.error('splitProduct error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
