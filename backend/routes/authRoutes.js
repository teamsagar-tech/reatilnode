const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/switch-firm', authenticateToken, authController.switchFirm);

// TOTP (Google Authenticator)
router.post('/totp/setup', authenticateToken, authController.setupTotp);
router.post('/login/totp', authController.loginTotp);

// Mobile OTP
router.post('/otp/send', authController.sendOtp);
router.post('/otp/verify', authController.verifyOtp);

// SuperAdmin Impersonation
const { superAdminMiddleware } = require('../middleware/superAdminMiddleware');
router.post('/impersonate/:userId', authenticateToken, superAdminMiddleware, authController.impersonateUser);

module.exports = router;
