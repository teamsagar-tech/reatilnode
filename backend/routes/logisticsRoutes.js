const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');
const { requirePermission } = require('../middleware/authMiddleware');

// Transporters
router.get('/transporters', requirePermission('masters', 'Read'), logisticsController.getTransporters);
router.post('/transporters', requirePermission('masters', 'Create'), logisticsController.createTransporter);

// Hundekaris
router.get('/hundekari', requirePermission('masters', 'Read'), logisticsController.getHundekaris);
router.post('/hundekari', requirePermission('masters', 'Create'), logisticsController.createHundekari);

// Unlinked LRs (LR Register)
router.get('/unlinked-lrs', requirePermission('inventory', 'Read'), logisticsController.getUnlinkedLRs);
router.post('/unlinked-lrs', requirePermission('inventory', 'Create'), logisticsController.createUnlinkedLR);

module.exports = router;
