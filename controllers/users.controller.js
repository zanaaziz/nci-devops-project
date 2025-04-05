const User = require('../models/user.model');

// Get all users (admin-only)
exports.getAllUsers = async (req, res) => {
	if (req.user.role !== 'admin') {
		return res.status(403).send('Access denied');
	}
	const users = await User.findAll();
	res.render('users/index', { users });
};

// Get current user's profile
exports.getUserProfile = async (req, res) => {
	const user = await User.findByPk(req.user.id);
	res.render('users/profile', { user });
};
