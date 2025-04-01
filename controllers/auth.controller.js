const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Render registration form
exports.getRegisterForm = (req, res) => {
	res.render('auth/register');
};

// Handle registration
exports.register = async (req, res) => {
	const { email, password, role } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({ email, password: hashedPassword, role });

	const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '9999 years' });
	res.cookie('token', token, { httpOnly: true });
	res.redirect('/tickets');
};

// Render login form
exports.getLoginForm = (req, res) => {
	res.render('auth/login');
};

// Handle login
exports.login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ where: { email } });
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).send('Invalid credentials');
	}
	const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '9999 years' });
	res.cookie('token', token, { httpOnly: true });
	res.redirect('/tickets');
};

// Handle logout
exports.logout = (req, res) => {
	res.clearCookie('token');
	res.redirect('/auth/login');
};
