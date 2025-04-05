const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');

// Get all tickets (admin sees all, users see their own)
exports.getAllTickets = async (req, res) => {
	let tickets;
	if (req.user.role === 'admin') {
		tickets = await Ticket.findAll({ include: [{ model: User, as: 'creator' }] });
	} else {
		tickets = await Ticket.findAll({ where: { creatorId: req.user.id }, include: [{ model: User, as: 'creator' }] });
	}
	res.render('tickets/index', { tickets });
};

// Render create ticket form
exports.getCreateTicketForm = (req, res) => {
	res.render('tickets/create');
};

// Create a new ticket
exports.createTicket = async (req, res) => {
	const { title, description } = req.body;
	await Ticket.create({ title, description, creatorId: req.user.id });
	res.redirect('/tickets');
};

// Get a single ticket by ID
exports.getTicketById = async (req, res) => {
	const ticket = await Ticket.findByPk(req.params.id, { include: [{ model: User, as: 'creator' }] });
	if (!ticket || (req.user.role !== 'admin' && ticket.creatorId !== req.user.id)) {
		return res.status(403).send('Access denied');
	}
	res.render('tickets/show', { ticket });
};

// Render edit ticket form
exports.getEditTicketForm = async (req, res) => {
	const ticket = await Ticket.findByPk(req.params.id);
	if (!ticket || (req.user.role !== 'admin' && ticket.creatorId !== req.user.id)) {
		return res.status(403).send('Access denied');
	}
	res.render('tickets/edit', { ticket });
};

// Update a ticket
exports.updateTicket = async (req, res) => {
	const ticket = await Ticket.findByPk(req.params.id);
	if (!ticket || (req.user.role !== 'admin' && ticket.creatorId !== req.user.id)) {
		return res.status(403).send('Access denied');
	}
	const { title, description, status } = req.body;
	await ticket.update({ title, description, status });
	res.redirect(`/tickets/${ticket.id}`);
};

// Delete a ticket
exports.deleteTicket = async (req, res) => {
	const ticket = await Ticket.findByPk(req.params.id);
	if (!ticket || (req.user.role !== 'admin' && ticket.creatorId !== req.user.id)) {
		return res.status(403).send('Access denied');
	}
	await ticket.destroy();
	res.redirect('/tickets');
};
