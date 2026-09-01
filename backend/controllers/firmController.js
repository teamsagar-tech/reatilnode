const db = require('../config/db');

exports.getAllFirms = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name, email, valid_till, max_users, max_firms, is_active, modules, created_at FROM Firms ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching firms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createFirm = async (req, res) => {
  const { name, email, mobile, max_users, valid_till, max_firms, modules } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Firm name is required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO Firms (name, email, mobile, max_users, valid_till, max_firms, modules) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [
        name, 
        email || null, 
        mobile || null, 
        max_users || 1, 
        valid_till || null, 
        max_firms || 1,
        modules ? JSON.stringify(modules) : null
      ]
    );
    const newFirm = {
      id: result.insertId,
      name,
      email,
      mobile,
      max_users,
      valid_till,
      max_firms,
      modules: modules || null,
      created_at: new Date().toISOString()
    };
    res.status(201).json(newFirm);
  } catch (error) {
    console.error('Error creating firm:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateFirm = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, max_users, valid_till, max_firms, modules } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Firm name is required' });
  }

  try {
    await db.execute(
      'UPDATE Firms SET name=?, email=?, mobile=?, max_users=?, valid_till=?, max_firms=?, modules=? WHERE id=?', 
      [
        name, 
        email || null, 
        mobile || null, 
        max_users || 1, 
        valid_till || null, 
        max_firms || 1,
        modules ? JSON.stringify(modules) : null,
        id
      ]
    );
    res.json({ message: 'Firm updated successfully' });
  } catch (error) {
    console.error('Error updating firm:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.toggleFirmStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT is_active FROM Firms WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Firm not found' });
    }
    
    const newStatus = rows[0].is_active ? 0 : 1;
    await db.execute('UPDATE Firms SET is_active = ? WHERE id = ?', [newStatus, id]);
    
    res.json({ message: 'Firm status updated successfully', is_active: newStatus });
  } catch (error) {
    console.error('Error toggling firm status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFirmUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, mobile_no, role, is_totp_enabled, created_at FROM Users WHERE firm_id = ? ORDER BY created_at DESC',
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching firm users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFirmById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT id, name, email, valid_till, max_users, max_firms, is_active, modules, created_at FROM Firms WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Firm not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching firm:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateFirmModules = async (req, res) => {
  const { id } = req.params;
  const { modules } = req.body;
  try {
    await db.execute('UPDATE Firms SET modules = ? WHERE id = ?', [modules ? JSON.stringify(modules) : null, id]);
    res.json({ message: 'Firm modules updated successfully' });
  } catch (error) {
    console.error('Error updating modules:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMyFirmProfile = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name, email, mobile, settings FROM Firms WHERE id = ?', [req.firm_id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Firm not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching firm profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateMyFirmProfile = async (req, res) => {
  const { name, email, mobile, settings } = req.body;
  if (!name) return res.status(400).json({ error: 'Firm name is required' });

  try {
    await db.execute(
      'UPDATE Firms SET name = ?, email = ?, mobile = ?, settings = ? WHERE id = ?',
      [name, email || null, mobile || null, settings ? JSON.stringify(settings) : null, req.firm_id]
    );
    res.json({ message: 'Firm profile updated successfully' });
  } catch (error) {
    console.error('Error updating firm profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createMyFirm = async (req, res) => {
  const { name, email, mobile, settings } = req.body;
  const user_id = req.user.id;

  if (!name) {
    return res.status(400).json({ error: 'Firm name is required' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Create the new Firm
    const [firmResult] = await connection.execute(
      'INSERT INTO Firms (name, email, mobile, max_users, max_firms, settings, modules) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email || null, mobile || null, 1, 1, settings ? JSON.stringify(settings) : null, null]
    );
    
    const newFirmId = firmResult.insertId;

    // 2. Map the user to this new firm as admin
    await connection.execute(
      'INSERT INTO UserFirms (user_id, firm_id, role) VALUES (?, ?, ?)',
      [user_id, newFirmId, 'admin']
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Firm created successfully',
      firm: {
        id: newFirmId,
        name,
        role: 'admin'
      }
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error creating my firm:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMyFirms = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT f.id, f.name, f.email, f.mobile, f.settings, uf.role
      FROM Firms f
      JOIN UserFirms uf ON f.id = uf.firm_id
      WHERE uf.user_id = ? AND uf.is_active = 1
    `, [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching my firms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateMyFirmById = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, settings } = req.body;
  if (!name) return res.status(400).json({ error: 'Firm name is required' });

  try {
    // Check if user is admin of this firm
    const [accessRows] = await db.execute('SELECT role FROM UserFirms WHERE user_id = ? AND firm_id = ? AND is_active = 1', [req.user.id, id]);
    if (accessRows.length === 0 || accessRows[0].role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to edit this firm' });
    }

    await db.execute(
      'UPDATE Firms SET name = ?, email = ?, mobile = ?, settings = ? WHERE id = ?',
      [name, email || null, mobile || null, settings ? JSON.stringify(settings) : null, id]
    );
    res.json({ message: 'Firm profile updated successfully' });
  } catch (error) {
    console.error('Error updating firm profile by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
