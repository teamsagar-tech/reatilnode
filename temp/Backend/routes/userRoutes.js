const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);
router.get('/', userController.getUsers);
router.get('/purchasers', userController.getPurchasers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.put('/:id/permissions', userController.updateUserPermissions);
router.put('/:id/role', userController.updateUserRole);
router.put('/:id/password', userController.updateUserPassword);

module.exports = router;
