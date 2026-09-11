const express = require('express');
const router = express.Router();
const cutController = require('../controllers/cutController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);

router.get('/', requirePermission('inventory', 'view'), cutController.getAll);
router.post('/', requirePermission('inventory', 'create'), cutController.create);
router.put('/:id', requirePermission('inventory', 'edit'), cutController.update);
router.delete('/:id', requirePermission('inventory', 'delete'), cutController.delete);

module.exports = router;
