const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');
const requirePermission = require('../middleware/rbacMiddleware');

// Apply auth and tenant isolation globally to these routes
router.use(authMiddleware);
router.use(tenantMiddleware);

// Only admins or users with 'settings' module write permission can create roles
router.post('/', requirePermission('settings', 'write'), roleController.createRole);
router.get('/', requirePermission('settings', 'read'), roleController.getRoles);

module.exports = router;
