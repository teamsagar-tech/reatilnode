const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Categories WHERE firm_id = ?', [req.firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Categories WHERE firm_id = ? AND id = ?', [req.firm_id, req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  const { name, parent_id, description, hsn_code, tax_percent } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const [result] = await db.execute(
      'INSERT INTO Categories (firm_id, name, parent_id, description, hsn_code, tax_percent) VALUES (?, ?, ?, ?, ?, ?)',
      [req.firm_id, name, parent_id || null, description || null, hsn_code || null, tax_percent || null]
    );
    res.status(201).json({ message: 'Category created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  const { name, parent_id, description, hsn_code, tax_percent } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE Categories SET name=?, parent_id=?, description=?, hsn_code=?, tax_percent=? WHERE id=? AND firm_id=?',
      [name, parent_id || null, description || null, hsn_code || null, tax_percent || null, req.params.id, req.firm_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Categories WHERE id=? AND firm_id=?', [req.params.id, req.firm_id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
