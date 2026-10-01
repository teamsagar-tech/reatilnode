const express = require('express');
const router = express.Router();
const genericMasterController = require('../controllers/genericMasterController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);

// Since this is generic, we can map to a general 'config' or 'inventory' permission.
// For finer control, requirePermission logic inside could be adapted based on req.params.type.
// For now, we use a general 'config' write permission for creating masters.

router.get('/:type', requirePermission('config', 'read'), genericMasterController.getAll);
router.get('/:type/:id', requirePermission('config', 'read'), genericMasterController.getById);
router.post('/:type', requirePermission('config', 'write'), genericMasterController.create);
router.put('/:type/:id', requirePermission('config', 'write'), genericMasterController.update);
router.delete('/:type/:id', requirePermission('config', 'delete'), genericMasterController.delete);

module.exports = router;
