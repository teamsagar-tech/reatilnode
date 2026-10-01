const express = require('express');
const router = express.Router();
const partyController = require('../controllers/partyController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);

router.get('/', requirePermission('accounting', 'read'), partyController.getAllParties);
router.post('/', requirePermission('accounting', 'write'), partyController.createParty);
router.put('/:id', requirePermission('accounting', 'write'), partyController.updateParty);
router.put('/:id/invoice-config', requirePermission('accounting', 'write'), partyController.updatePartyInvoiceConfig);
router.delete('/:id', requirePermission('accounting', 'delete'), partyController.deleteParty);

module.exports = router;
