const db = require('../config/db');

/**
 * Middleware to enforce Role-Based Access Control
 * MUST run after `authMiddleware` and `tenantMiddleware`.
 * 
 * @param {string} moduleName - The module being accessed (e.g., 'inventory', 'sales')
 * @param {string} action - 'read', 'write', or 'delete'
 */
const requirePermission = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      // Admins and Superadmins bypass module restrictions
      if (req.user.role === 'admin' || req.user.role === 'superadmin') {
        return next();
      }

      // If user has a custom role (not admin), we must have attached a role_id to them.
      // We check the RolePermissions table.
      if (!req.user.role_id) {
        return res.status(403).json({ error: 'User does not have an assigned role' });
      }

      const columnToCheck = action === 'read' ? 'can_read' : (action === 'write' ? 'can_write' : 'can_delete');
      
      const [rows] = await db.execute(
        `SELECT ${columnToCheck} FROM RolePermissions WHERE role_id = ? AND module_name = ?`,
        [req.user.role_id, moduleName]
      );

      if (rows.length === 0 || rows[0][columnToCheck] !== 1) {
        return res.status(403).json({ 
          error: `Access Denied: You do not have permission to ${action} ${moduleName}` 
        });
      }

      next();
    } catch (error) {
      console.error('RBAC Error:', error);
      res.status(500).json({ error: 'Internal server error during permission check' });
    }
  };
};

module.exports = { requirePermission };
