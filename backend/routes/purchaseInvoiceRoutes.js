const express = require('express');
const router = express.Router();
const purchaseInvoiceController = require('../controllers/purchaseInvoiceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');

const multer = require('multer');
const upload = multer({ dest: '/tmp/uploads/' });
const importController = require('../controllers/purchaseInvoiceImportController');

router.use(authenticateToken);
router.use(tenantMiddleware);

router.get('/', requirePermission('purchaseInvoice', 'view'), purchaseInvoiceController.getAll);
router.get('/:id', requirePermission('purchaseInvoice', 'view'), purchaseInvoiceController.getById);
router.post('/', requirePermission('purchaseInvoice', 'create'), purchaseInvoiceController.create);
router.delete('/:id', requirePermission('purchaseInvoice', 'delete'), purchaseInvoiceController.delete);

router.post('/preview-import', requirePermission('purchaseInvoice', 'create'), upload.single('file'), importController.importPreview);

module.exports = router;
