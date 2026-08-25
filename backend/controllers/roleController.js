const db = require('../config/db');

exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;
  // permissions format: [{ module_name: 'inventory', can_read: true, can_write: false, can_delete: false }]

  if (!name || !Array.isArray(permissions)) {
    return res.status(400).json({ error: 'Role name and permissions array are required' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [roleResult] = await connection.execute(
      'INSERT INTO Roles (firm_id, name) VALUES (?, ?)',
      [req.firm_id, name]
    );
    const roleId = roleResult.insertId;

    for (const perm of permissions) {
      await connection.execute(
        'INSERT INTO RolePermissions (role_id, module_name, can_read, can_write, can_delete) VALUES (?, ?, ?, ?, ?)',
        [roleId, perm.module_name, perm.can_read ? 1 : 0, perm.can_write ? 1 : 0, perm.can_delete ? 1 : 0]
      );
    }

    await connection.commit();
    connection.release();

    res.status(201).json({ message: 'Role created successfully', roleId });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error creating role:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A role with this name already exists in your firm' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const [roles] = await db.execute(
      'SELECT id, name, created_at FROM Roles WHERE firm_id = ?',
      [req.firm_id]
    );
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
