const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.get('/', requirePermission('inventory', 'read'), purchaseOrderController.list);
router.get('/:id', requirePermission('inventory', 'read'), purchaseOrderController.getById);
router.post('/', requirePermission('inventory', 'write'), purchaseOrderController.create);

module.exports = router;
