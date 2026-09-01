const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.get('/purchasers', userController.getPurchasers);
router.put('/:id/permissions', userController.updateUserPermissions);
router.put('/:id/role', userController.updateUserRole);
router.put('/:id/password', userController.updateUserPassword);

module.exports = router;
