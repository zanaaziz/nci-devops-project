const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
	if (process.env.NODE_ENV === 'test') {
		return;
	}

	try {
		// Check if users already exist
		const userCount = await User.count();
		if (userCount === 0) {
			// Seed admin user
			await User.create({
				email: 'admin@email.com',
				password: await bcrypt.hash('admin', 10),
				role: 'admin',
			});

			// Seed regular user
			const user = await User.create({
				email: 'user@email.com',
				password: await bcrypt.hash('user', 10),
				role: 'user',
			});

			// Seed sample tickets
			await Ticket.create({
				title: 'Sample Ticket 1',
				description: 'This is a sample ticket',
				creatorId: user.id,
			});

			await Ticket.create({
				title: 'Sample Ticket 2',
				description: 'This is another sample ticket',
				creatorId: user.id,
			});

			console.log('Database seeded successfully');
		} else {
			console.log('Database already seeded');
		}
	} catch (err) {
		console.error('Error seeding database:', err);
	}
};

module.exports = seedDatabase;
