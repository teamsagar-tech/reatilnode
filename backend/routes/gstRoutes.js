const express = require('express');
const router = express.Router();
const gstController = require('../controllers/gstController');

router.get('/captcha', gstController.getCaptcha);
router.post('/details', gstController.getGSTDetails);
router.get('/cache/:gstin', gstController.getCachedGST);
router.get('/search-hsn-catalog', gstController.searchHSNCatalog);

module.exports = router;
