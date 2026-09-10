const express = require('express');
const router = express.Router();
const sizeGroupController = require('../controllers/sizeGroupController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);

// Global Size Group endpoints
router.get('/', requirePermission('inventory', 'read'), sizeGroupController.getAll);
router.post('/', requirePermission('inventory', 'write'), sizeGroupController.create);
router.put('/:id', requirePermission('inventory', 'write'), sizeGroupController.update);
router.delete('/:id', requirePermission('inventory', 'delete'), sizeGroupController.delete);

// Brand specific Size Group mapping endpoints
router.get('/brand/:brandId', requirePermission('inventory', 'read'), sizeGroupController.getByBrand);
router.post('/brand/:brandId', requirePermission('inventory', 'write'), sizeGroupController.linkToBrand);

module.exports = router;
