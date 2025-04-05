const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const methodOverride = require('method-override');
const sequelize = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const ticketsRoutes = require('./routes/tickets.routes');
const usersRoutes = require('./routes/users.routes');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
require('dotenv').config();

// Check the environment
const isProduction = process.env.NODE_ENV === 'prod';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method')); // Support PUT and DELETE in forms

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketsRoutes);
app.use('/users', usersRoutes);

// Root route with redirection logic
app.get('/', authMiddleware, (req, res) => {
	res.redirect('/tickets'); // Authenticated users go to /tickets, else middleware sends them to auth/login
});

// Error Handling
app.use(errorMiddleware);

// Sync and Seed Database on Startup
(async () => {
	try {
		await sequelize.sync();
		const seedDatabase = require('./seeders/seed');
		await seedDatabase();
	} catch (err) {
		console.error('Error syncing or seeding database:', err);
	}
})();

// Server setup
let server;

if (isProduction) {
	// HTTPS in production
	const httpsOptions = {
		key: fs.readFileSync(path.join(__dirname, 'privatekey.pem')),
		cert: fs.readFileSync(path.join(__dirname, 'server.crt')),
	};

	server = https.createServer(httpsOptions, app);
} else {
	// HTTP in development
	server = http.createServer(app);
}

// Start the server (if not in test env)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
	server.listen(PORT, () => {
		if (isProduction) {
			console.log(`HTTPS Server running on port ${PORT}`);
		} else {
			console.log(`HTTP Server running on port ${PORT}`);
		}
	});
}

module.exports = app;
