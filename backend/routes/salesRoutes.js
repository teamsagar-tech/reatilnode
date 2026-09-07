const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { requirePermission } = require('../middleware/authMiddleware');

router.get('/scan/:barcode', requirePermission('sales', 'Create'), salesController.scanProduct);
router.post('/bill', requirePermission('sales', 'Create'), salesController.createSalesBill);

module.exports = router;
