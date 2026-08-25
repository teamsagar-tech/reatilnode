/**
 * Tenant Isolation Middleware
 * MUST be used after authMiddleware.
 * Ensures the authenticated user has a firm_id and attaches it to req.firm_id for easy access.
 */
const tenantMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required before verifying tenant' });
  }

  if (!req.user.firm_id) {
    return res.status(403).json({ error: 'User does not belong to a valid firm (tenant)' });
  }

  // Inject firm_id into the request object to be used in all SQL queries
  req.firm_id = req.user.firm_id;
  
  next();
};

module.exports = tenantMiddleware;
