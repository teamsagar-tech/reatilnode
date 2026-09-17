const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');
const { requirePermission } = require('../middleware/rbacMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);

// Transporters
router.get('/transporters', requirePermission('masters', 'read'), logisticsController.getTransporters);
router.post('/transporters', requirePermission('masters', 'write'), logisticsController.createTransporter);
router.put('/transporters/:id', requirePermission('masters', 'write'), logisticsController.updateTransporter);

// Hundekaris
router.get('/hundekari', requirePermission('masters', 'read'), logisticsController.getHundekaris);
router.post('/hundekari', requirePermission('masters', 'write'), logisticsController.createHundekari);

// Unlinked LRs (LR Register)
router.get('/unlinked-lrs', requirePermission('logistics', 'read'), logisticsController.getUnlinkedLRs);
router.post('/unlinked-lrs', requirePermission('logistics', 'write'), logisticsController.createUnlinkedLR);
router.post('/bulk-unlinked-lrs', requirePermission('logistics', 'write'), logisticsController.createBulkUnlinkedLR);
router.post('/verify-lr-bales', requirePermission('logistics', 'read'), logisticsController.verifyLRBales);
router.post('/verify-unlinked-lr', requirePermission('logistics', 'read'), logisticsController.verifyUnlinkedLR);

// Pending LRs from Purchase Invoices
router.get('/pending-lrs', requirePermission('logistics', 'read'), logisticsController.getPendingLRs);

// Hundekari Payments
router.get('/hundekari-pending-lrs/:hundekari_id', requirePermission('logistics', 'read'), logisticsController.getHundekariPendingLRs);
router.post('/hundekari-payments', requirePermission('logistics', 'write'), logisticsController.createHundekariPayment);
router.get('/hundekari-payments', requirePermission('logistics', 'read'), logisticsController.getHundekariPayments);

module.exports = router;
