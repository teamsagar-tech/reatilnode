const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);

// Typically vendors fall under 'purchases' module for permissions
router.get('/', requirePermission('purchases', 'read'), vendorController.getAll);
router.get('/:id', requirePermission('purchases', 'read'), vendorController.getById);
router.post('/', requirePermission('purchases', 'write'), vendorController.create);
router.put('/:id', requirePermission('purchases', 'write'), vendorController.update);
router.delete('/:id', requirePermission('purchases', 'delete'), vendorController.delete);

module.exports = router;
