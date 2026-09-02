const db = require('../config/db');

exports.updateUserPermissions = async (req, res) => {
  const { id } = req.params;
  const { permissions, expires_at } = req.body;

  try {
    if (req.user.role !== 'superadmin') {
      const [userRows] = await db.execute('SELECT firm_id FROM Users WHERE id = ?', [id]);
      if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
      if (userRows[0].firm_id !== req.user.firm_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    await db.execute('UPDATE Users SET permissions_override = ?, override_expires_at = ? WHERE id = ?', [
      permissions ? JSON.stringify(permissions) : null,
      expires_at ? new Date(expires_at) : null,
      id
    ]);
    res.json({ message: 'User permissions override updated successfully' });
  } catch (error) {
    console.error('Error updating user permissions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;

  try {
    if (req.user.role !== 'superadmin') {
      const [userRows] = await db.execute('SELECT firm_id FROM Users WHERE id = ?', [id]);
      if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
      if (userRows[0].firm_id !== req.user.firm_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    
    if (role_id === 'admin' || role_id === 'user') {
      // Revert to built-in role
      await db.execute('UPDATE Users SET role = ?, role_id = NULL WHERE id = ?', [role_id, id]);
    } else {
      // Assign custom role_id, set base role to 'user'
      await db.execute('UPDATE Users SET role = "user", role_id = ? WHERE id = ?', [role_id || null, id]);
    }

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const bcrypt = require('bcrypt');

exports.updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    if (req.user.role !== 'superadmin') {
      const [userRows] = await db.execute('SELECT firm_id FROM Users WHERE id = ?', [id]);
      if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
      if (userRows[0].firm_id !== req.user.firm_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('UPDATE Users SET password = ? WHERE id = ?', [hashedPassword, id]);
    res.json({ message: 'User password updated successfully' });
  } catch (error) {
    console.error('Error updating user password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPurchasers = async (req, res) => {
  try {
    const firm_id = req.user.firm_id;
    if (!firm_id && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Firm context missing' });
    }
    
    // For superadmin without firm context, they can pass firm_id in query (fallback)
    const targetFirm = firm_id || req.query.firm_id || 1; // Default to 1 (VRP) for superadmin if not provided

    const [users] = await db.execute(`
      SELECT DISTINCT u.id, u.email, u.name 
      FROM Users u
      LEFT JOIN RolePermissions rp ON u.role_id = rp.role_id AND rp.module_name = 'purchaseInvoice'
      WHERE u.firm_id = ? AND (u.role = 'admin' OR rp.can_write = 1)
    `, [targetFirm]);

    res.json(users);
  } catch (error) {
    console.error('Error fetching purchasers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
