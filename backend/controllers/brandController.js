const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Brands WHERE firm_id = ?', [req.firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Brands WHERE firm_id = ? AND id = ?', [req.firm_id, req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const [existing] = await db.execute('SELECT id FROM Brands WHERE firm_id = ? AND LOWER(name) = LOWER(?)', [req.firm_id, name]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Brand with this name already exists.' });
    }

    const [result] = await db.execute(
      'INSERT INTO Brands (firm_id, name, description) VALUES (?, ?, ?)',
      [req.firm_id, name, description || null]
    );
    res.status(201).json({ message: 'Brand created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  const { name, description } = req.body;
  try {
    const [existing] = await db.execute('SELECT id FROM Brands WHERE firm_id = ? AND LOWER(name) = LOWER(?) AND id != ?', [req.firm_id, name, req.params.id]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Brand with this name already exists.' });
    }

    const [result] = await db.execute(
      'UPDATE Brands SET name=?, description=? WHERE id=? AND firm_id=?',
      [name, description || null, req.params.id, req.firm_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json({ message: 'Brand updated successfully' });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Brands WHERE id=? AND firm_id=?', [req.params.id, req.firm_id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Brand not found' });
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
