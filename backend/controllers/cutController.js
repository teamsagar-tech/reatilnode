const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM CutMaster WHERE firm_id = ? ORDER BY id DESC', [req.firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cut master:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  const { cut_name, cut_size } = req.body;
  if (!cut_name || !cut_size) return res.status(400).json({ error: 'cut_name and cut_size are required' });

  try {
    const [result] = await db.execute(
      'INSERT INTO CutMaster (firm_id, cut_name, cut_size) VALUES (?, ?, ?)',
      [req.firm_id, cut_name, parseFloat(cut_size)]
    );
    res.status(201).json({ message: 'Cut created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating cut:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  const { cut_name, cut_size } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE CutMaster SET cut_name=?, cut_size=? WHERE id=? AND firm_id=?',
      [cut_name, parseFloat(cut_size), req.params.id, req.firm_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cut not found' });
    res.json({ message: 'Cut updated successfully' });
  } catch (error) {
    console.error('Error updating cut:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM CutMaster WHERE id=? AND firm_id=?', [req.params.id, req.firm_id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cut not found' });
    res.json({ message: 'Cut deleted successfully' });
  } catch (error) {
    console.error('Error deleting cut:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
