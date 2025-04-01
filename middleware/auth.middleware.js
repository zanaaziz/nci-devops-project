const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
	// Extract token from cookie
	const token = req.cookies.token;

	// Check if token exists
	if (!token) {
		console.error('No token provided');
		return res.redirect('/auth/login');
	}

	try {
		// Verify the token with your secret key
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Attach decoded user data to the request
		res.locals.user = req.user || null; // Make user available to all templates
		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		console.error('Invalid token');
		return res.redirect('/auth/login');
	}
};

module.exports = authMiddleware;
