const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');

// Protect all notification routes
router.use(authenticateToken);
router.use(tenantMiddleware);

// Web Push Subscription
router.post('/subscribe', notificationController.subscribeToPush);

// In-App Notification History & Actions
router.get('/', notificationController.getInAppNotifications);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
