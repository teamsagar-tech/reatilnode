const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);

router.get('/', requirePermission('inventory', 'read'), categoryController.getAll);
router.get('/:id', requirePermission('inventory', 'read'), categoryController.getById);
router.post('/', requirePermission('inventory', 'write'), categoryController.create);
router.put('/:id', requirePermission('inventory', 'write'), categoryController.update);
router.delete('/:id', requirePermission('inventory', 'delete'), categoryController.delete);

module.exports = router;
