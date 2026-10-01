const superAdminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: No user found' });
  }

  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden: Super Admin access required' });
  }

  // Super admins are authorized
  next();
};

module.exports = { superAdminMiddleware };
