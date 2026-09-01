const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');
const maskData = require('../utils/maskData');

router.use(authenticateToken);
router.use(tenantMiddleware);

// Mock inventory data representing what we would get from DB
const mockInventoryItem = {
  id: 101,
  name: 'Premium Leather Jacket',
  stock: 45,
  selling_price: 199.99,
  cost_price: 80.00,       // Sensitive
  supplier_id: 'SUP-442',  // Sensitive
  profit_margin: '60%'     // Sensitive
};

// GET /api/inventory/test
router.get('/test', requirePermission('inventory', 'read'), (req, res) => {
  // In a real app, we fetch from DB where firm_id = req.firm_id
  const rawData = { ...mockInventoryItem };

  // Mask the data before sending it back
  // Pass req.user.role if it's admin, otherwise we can assume their custom role name or just use 'cashier' for testing
  // In our DB schema, custom roles are IDs. We would normally join to get the role name.
  // For the sake of this test, we will pretend req.user.role_name was attached.
  
  const roleName = req.user.role === 'admin' ? 'admin' : req.user.role_name || 'cashier';
  
  const safeData = maskData(rawData, 'inventory', roleName);
  
  res.json({
    message: 'Inventory fetched successfully',
    your_role: roleName,
    data: safeData
  });
});

module.exports = router;
