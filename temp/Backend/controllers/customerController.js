const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Customers WHERE firm_id = ?', [req.firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Customers WHERE firm_id = ? AND id = ?', [req.firm_id, req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  const { name, mobile, email, gst_no, billing_address, opening_balance, tally_guid } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const [result] = await db.execute(
      'INSERT INTO Customers (firm_id, name, mobile, email, gst_no, billing_address, opening_balance, tally_guid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.firm_id, name, mobile || null, email || null, gst_no || null, billing_address || null, opening_balance || 0, tally_guid || null]
    );
    res.status(201).json({ message: 'Customer created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  const { name, mobile, email, gst_no, billing_address, opening_balance, tally_guid } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE Customers SET name=?, mobile=?, email=?, gst_no=?, billing_address=?, opening_balance=?, tally_guid=? WHERE id=? AND firm_id=?',
      [name, mobile || null, email || null, gst_no || null, billing_address || null, opening_balance || 0, tally_guid || null, req.params.id, req.firm_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Customers WHERE id=? AND firm_id=?', [req.params.id, req.firm_id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
