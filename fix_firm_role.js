const fs = require('fs');
const path = require('path');

// 1. Add route to firmRoutes.js
const routesPath = path.join(__dirname, 'backend', 'routes', 'firmRoutes.js');
let routes = fs.readFileSync(routesPath, 'utf8');
if (!routes.includes('updateFirmUserRole')) {
    routes = routes.replace(
        "router.get('/:id/users', firmController.getFirmUsers);",
        "router.get('/:id/users', firmController.getFirmUsers);\nrouter.put('/:id/users/:userId/role', firmController.updateFirmUserRole);"
    );
    fs.writeFileSync(routesPath, routes);
    console.log('Added route to firmRoutes.js');
}

// 2. Add controller function to firmController.js
const ctrlPath = path.join(__dirname, 'backend', 'controllers', 'firmController.js');
let ctrl = fs.readFileSync(ctrlPath, 'utf8');
if (!ctrl.includes('exports.updateFirmUserRole')) {
    const fn = `

exports.updateFirmUserRole = async (req, res) => {
  const { id, userId } = req.params;
  const { role, role_id } = req.body;

  try {
    if (role === 'admin' || role === 'user' || role === 'superadmin') {
      await db.execute('UPDATE Users SET role = ?, role_id = NULL WHERE id = ?', [role, userId]);
      await db.execute('UPDATE UserFirms SET role = ? WHERE user_id = ? AND firm_id = ?', [role, userId, id]);
    } else {
      await db.execute('UPDATE Users SET role = "user", role_id = ? WHERE id = ?', [role_id || null, userId]);
      await db.execute('UPDATE UserFirms SET role = "user" WHERE user_id = ? AND firm_id = ?', [userId, id]);
    }
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
`;
    fs.writeFileSync(ctrlPath, ctrl + fn);
    console.log('Added updateFirmUserRole to firmController.js');
}
