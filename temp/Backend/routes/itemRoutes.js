const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');
// Assuming requirePermission('module', 'action') -> returns a middleware

router.use(authenticateToken);
router.use(tenantMiddleware);

router.get('/', requirePermission('inventory', 'read'), itemController.getAll);
router.get('/:id', requirePermission('inventory', 'read'), itemController.getById);
router.post('/', requirePermission('inventory', 'write'), itemController.create);
router.put('/:id', requirePermission('inventory', 'write'), itemController.update);
router.delete('/:id', requirePermission('inventory', 'delete'), itemController.delete);

module.exports = router;
