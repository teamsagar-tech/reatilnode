const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);

module.exports = router;
