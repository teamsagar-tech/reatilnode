const express = require('express');
const router = express.Router();
const firmController = require('../controllers/firmController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { superAdminMiddleware } = require('../middleware/superAdminMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');

router.use(authenticateToken);

// Normal user routes
router.get('/me/all', firmController.getMyFirms);
router.get('/profile', tenantMiddleware, firmController.getMyFirmProfile);
router.put('/profile', tenantMiddleware, firmController.updateMyFirmProfile);
router.put('/me/:id', firmController.updateMyFirmById);
router.post('/me/new', firmController.createMyFirm);

// SuperAdmin only routes
router.use(superAdminMiddleware);

router.get('/', firmController.getAllFirms);
router.post('/', firmController.createFirm);
router.put('/:id', firmController.updateFirm);
router.patch('/:id/status', firmController.toggleFirmStatus);
router.get('/:id', firmController.getFirmById);
router.get('/:id/users', firmController.getFirmUsers);
router.put('/:id/users/:userId/role', firmController.updateFirmUserRole);
router.put('/:id/modules', firmController.updateFirmModules);

module.exports = router;
