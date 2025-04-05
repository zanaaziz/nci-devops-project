const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware); // Apply authentication to all ticket routes

router.get('/', ticketsController.getAllTickets);
router.get('/create', ticketsController.getCreateTicketForm);
router.post('/', ticketsController.createTicket);
router.get('/:id', ticketsController.getTicketById);
router.get('/:id/edit', ticketsController.getEditTicketForm);
router.put('/:id', ticketsController.updateTicket);
router.delete('/:id', ticketsController.deleteTicket);

module.exports = router;
