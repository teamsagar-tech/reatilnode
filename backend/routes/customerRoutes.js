const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);

// Usually permissions for customers is handled by 'parties' or 'sales' module.
router.get('/', requirePermission('sales', 'read'), customerController.getAll);
router.get('/:id', requirePermission('sales', 'read'), customerController.getById);
router.post('/', requirePermission('sales', 'write'), customerController.create);
router.put('/:id', requirePermission('sales', 'write'), customerController.update);
router.delete('/:id', requirePermission('sales', 'delete'), customerController.delete);

module.exports = router;
