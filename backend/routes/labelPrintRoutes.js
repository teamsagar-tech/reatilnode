const express = require('express');
const router = express.Router();
const labelPrintController = require('../controllers/labelPrintController');
const { requirePermission } = require('../middleware/authMiddleware');

const bulkLabelPrintController = require('../controllers/bulkLabelPrintController');

router.post('/batch', requirePermission('inventory', 'Read'), labelPrintController.getPrintableBatch);
router.get('/settings', requirePermission('inventory', 'Read'), labelPrintController.getLabelPrintSettings);

// Bulk routes
router.get('/bulk-invoices', requirePermission('inventory', 'Read'), bulkLabelPrintController.getInvoicesForBulk);
router.post('/bulk-preview', requirePermission('inventory', 'Create'), bulkLabelPrintController.previewBulkProducts);
router.post('/bulk-create', requirePermission('inventory', 'Create'), bulkLabelPrintController.createBulkProducts);

module.exports = router;
