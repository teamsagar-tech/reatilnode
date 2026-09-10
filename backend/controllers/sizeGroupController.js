const db = require('../config/db');

// Get all Size Groups globally for a firm
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM SizeGroups WHERE firm_id = ? ORDER BY id DESC',
      [req.firm_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching size groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new Size Group
exports.create = async (req, res) => {
  const { groupName, sizes } = req.body;
  if (!groupName || !sizes || !Array.isArray(sizes) || sizes.length === 0) {
    return res.status(400).json({ error: 'Group name and an array of sizes are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO SizeGroups (firm_id, group_name, sizes) VALUES (?, ?, ?)',
      [req.firm_id, groupName, JSON.stringify(sizes)]
    );
    res.status(201).json({ id: result.insertId, groupName, sizes });
  } catch (error) {
    console.error('Error creating size group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an existing Size Group
exports.update = async (req, res) => {
  const { id } = req.params;
  const { groupName, sizes, isActive } = req.body;

  if (!groupName || !sizes || !Array.isArray(sizes) || sizes.length === 0) {
    return res.status(400).json({ error: 'Group name and an array of sizes are required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE SizeGroups SET group_name = ?, sizes = ?, is_active = ? WHERE id = ? AND firm_id = ?',
      [groupName, JSON.stringify(sizes), isActive !== false, id, req.firm_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Size group not found or unauthorized' });
    }
    res.json({ message: 'Size group updated successfully' });
  } catch (error) {
    console.error('Error updating size group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a Size Group
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      'DELETE FROM SizeGroups WHERE id = ? AND firm_id = ?',
      [id, req.firm_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Size group not found or unauthorized' });
    }
    res.json({ message: 'Size group deleted successfully' });
  } catch (error) {
    console.error('Error deleting size group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ================= BRAND MAPPING =================

// Get all Size Groups linked to a specific brand
exports.getByBrand = async (req, res) => {
  const { brandId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT sg.* FROM SizeGroups sg 
       JOIN BrandSizeGroups bsg ON sg.id = bsg.size_group_id 
       WHERE bsg.firm_id = ? AND bsg.brand_id = ?`,
      [req.firm_id, brandId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching brand size groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Link Size Groups to a Brand (Bulk replace)
exports.linkToBrand = async (req, res) => {
  const { brandId } = req.params;
  const { sizeGroupIds } = req.body; // Array of IDs

  if (!Array.isArray(sizeGroupIds)) {
    return res.status(400).json({ error: 'sizeGroupIds must be an array' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Remove existing links for this brand
    await connection.execute(
      'DELETE FROM BrandSizeGroups WHERE firm_id = ? AND brand_id = ?',
      [req.firm_id, brandId]
    );

    // Insert new links
    if (sizeGroupIds.length > 0) {
      const values = sizeGroupIds.map(groupId => [req.firm_id, brandId, groupId]);
      await connection.query(
        'INSERT INTO BrandSizeGroups (firm_id, brand_id, size_group_id) VALUES ?',
        [values]
      );
    }

    await connection.commit();
    res.json({ message: 'Brand size groups updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error linking brand size groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};
