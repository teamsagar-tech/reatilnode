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

module.exports = router;
