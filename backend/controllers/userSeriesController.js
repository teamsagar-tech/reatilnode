const db = require('../config/db');

exports.getSeries = async (req, res) => {
  try {
    const firm_id = req.user.firm_id;
    const [rows] = await db.execute('SELECT * FROM UserSeries WHERE firm_id = ? ORDER BY id DESC', [firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user series:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createSeries = async (req, res) => {
  try {
    const firm_id = req.user.firm_id;
    const { series_name, start_num, end_num } = req.body;
    
    if (!series_name || !start_num || !end_num) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await db.execute(
      'INSERT INTO UserSeries (firm_id, series_name, start_num, end_num, current_num) VALUES (?, ?, ?, ?, ?)',
      [firm_id, series_name, start_num, end_num, start_num - 1]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Series created successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Series name already exists for this firm' });
    }
    console.error('Error creating user series:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const firm_id = req.user.firm_id;
    const { series_name, start_num, end_num } = req.body;
    
    await db.execute(
      'UPDATE UserSeries SET series_name = ?, start_num = ?, end_num = ? WHERE id = ? AND firm_id = ?',
      [series_name, start_num, end_num, id, firm_id]
    );
    
    res.json({ message: 'Series updated successfully' });
  } catch (error) {
    console.error('Error updating user series:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const firm_id = req.user.firm_id;
    
    await db.execute('DELETE FROM UserSeries WHERE id = ? AND firm_id = ?', [id, firm_id]);
    res.json({ message: 'Series deleted successfully' });
  } catch (error) {
    console.error('Error deleting user series:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
