const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');

// All ticket routes require authentication and tenant context
router.use(authenticateToken);
router.use(tenantMiddleware);

// Ticket CRUD
router.post('/', ticketController.createTicket);
router.get('/', ticketController.getTickets);
router.get('/:id/messages', ticketController.getTicketMessages);
router.post('/:id/messages', ticketController.replyToTicket);
router.put('/:id/status', ticketController.updateTicketStatus);

module.exports = router;
