const express = require('express');
const router = express.Router();
const manageReceivableController = require('../controllers/manageReceivableController');
const { requirePermission } = require('../middleware/authMiddleware');

router.get('/search', requirePermission('inventory', 'Read'), manageReceivableController.searchReceivables);
router.post('/update', requirePermission('inventory', 'Update'), manageReceivableController.updateBatchProducts);
router.post('/split', requirePermission('inventory', 'Update'), manageReceivableController.splitProduct);

module.exports = router;
