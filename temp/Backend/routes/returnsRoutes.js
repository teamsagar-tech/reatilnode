const express = require('express');
const router = express.Router();
const returnsController = require('../controllers/returnsController');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.post('/sales', requirePermission('sales', 'Create'), returnsController.processSalesReturn);
router.post('/purchase', requirePermission('purchase', 'Create'), returnsController.processPurchaseReturn);

module.exports = router;
