const express = require('express');
const router = express.Router();
const userSeriesController = require('../controllers/userSeriesController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');

router.use(authenticateToken);
router.use(tenantMiddleware);

router.get('/', userSeriesController.getSeries);
router.post('/', userSeriesController.createSeries);
router.put('/:id', userSeriesController.updateSeries);
router.delete('/:id', userSeriesController.deleteSeries);

module.exports = router;
