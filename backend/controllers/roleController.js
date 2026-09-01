const db = require('../config/db');

exports.getAllRoles = async (req, res) => {
  try {
    const firmId = req.user.role === 'superadmin' && req.query.firm_id ? req.query.firm_id : req.user.firm_id;
    const [rows] = await db.execute('SELECT * FROM Roles WHERE firm_id = ? ORDER BY created_at DESC', [firmId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;
  const firmId = req.user.role === 'superadmin' && req.body.firm_id ? req.body.firm_id : req.user.firm_id;

  try {
    const [result] = await db.execute(
      'INSERT INTO Roles (firm_id, name, permissions) VALUES (?, ?, ?)',
      [firmId, name, permissions ? JSON.stringify(permissions) : null]
    );
    res.status(201).json({ id: result.insertId, message: 'Role created successfully' });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  try {
    // Verify ownership
    const [roleRows] = await db.execute('SELECT firm_id FROM Roles WHERE id = ?', [id]);
    if (roleRows.length === 0) return res.status(404).json({ error: 'Role not found' });
    if (req.user.role !== 'superadmin' && roleRows[0].firm_id !== req.user.firm_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await db.execute(
      'UPDATE Roles SET name = ?, permissions = ? WHERE id = ?',
      [name, permissions ? JSON.stringify(permissions) : null, id]
    );
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
