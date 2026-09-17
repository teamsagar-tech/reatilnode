const express = require('express');
const router = express.Router();
const labelPrintController = require('../controllers/labelPrintController');
const { requirePermission } = require('../middleware/rbacMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');

const bulkLabelPrintController = require('../controllers/bulkLabelPrintController');

router.post('/batch', authenticateToken, tenantMiddleware, requirePermission('inventory', 'Read'), labelPrintController.getPrintableBatch);
router.get('/settings', authenticateToken, tenantMiddleware, requirePermission('inventory', 'Read'), labelPrintController.getLabelPrintSettings);

// New Inward-to-LabelPrint Workflow Routes
router.post('/invoice-items', authenticateToken, tenantMiddleware, requirePermission('inventory', 'Read'), labelPrintController.getInvoiceItemsByLR);
router.post('/generate-barcodes', authenticateToken, tenantMiddleware, requirePermission('inventory', 'Create'), labelPrintController.generateBarcodes);
router.get('/generated-barcodes/:invoice_product_id', authenticateToken, tenantMiddleware, requirePermission('inventory', 'Read'), labelPrintController.getGeneratedBarcodes);

// Bulk routes
router.get('/bulk-invoices', authenticateToken, tenantMiddleware, requirePermission('inventory', 'Read'), bulkLabelPrintController.getInvoicesForBulk);
router.post('/bulk-preview', authenticateToken, tenantMiddleware, requirePermission('inventory', 'Create'), bulkLabelPrintController.previewBulkProducts);
router.post('/bulk-create', authenticateToken, tenantMiddleware, requirePermission('inventory', 'Create'), bulkLabelPrintController.createBulkProducts);

module.exports = router;
