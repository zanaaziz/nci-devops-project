const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/db.config');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

describe('Auth Routes', () => {
	// Reset the database before each test
	beforeEach(async () => {
		await sequelize.sync({ force: true });
	});

	// Test registration
	test('POST /auth/register should register a new user and redirect to /tickets', async () => {
		const response = await request(app).post('/auth/register').send({ email: 'test@example.com', password: 'password123', role: 'user' });

		expect(response.status).toBe(302);
		expect(response.header.location).toBe('/tickets');

		const user = await User.findOne({ where: { email: 'test@example.com' } });
		expect(user).not.toBeNull();
		expect(user.role).toBe('user');

		const cookies = response.headers['set-cookie'];
		expect(cookies).toBeDefined();
		expect(cookies.some((cookie) => cookie.startsWith('token='))).toBe(true);
	});

	// Test successful login
	test('POST /auth/login should login the user and redirect to /tickets', async () => {
		const hashedPassword = await bcrypt.hash('password123', 10);
		await User.create({ email: 'test@example.com', password: hashedPassword, role: 'user' });

		const response = await request(app).post('/auth/login').send({ email: 'test@example.com', password: 'password123' });

		expect(response.status).toBe(302);
		expect(response.header.location).toBe('/tickets');

		const cookies = response.headers['set-cookie'];
		expect(cookies).toBeDefined();
		expect(cookies.some((cookie) => cookie.startsWith('token='))).toBe(true);
	});

	// Test login with invalid credentials
	test('POST /auth/login with invalid credentials should return 401', async () => {
		const response = await request(app).post('/auth/login').send({ email: 'nonexistent@example.com', password: 'wrong' });

		expect(response.status).toBe(401);
		expect(response.text).toBe('Invalid credentials');
	});

	// Test logout
	test('GET /auth/logout should logout the user and redirect to /auth/login', async () => {
		const hashedPassword = await bcrypt.hash('password123', 10);
		await User.create({ email: 'test@example.com', password: hashedPassword, role: 'user' });

		const agent = request.agent(app);
		await agent.post('/auth/login').send({ email: 'test@example.com', password: 'password123' });

		const response = await agent.get('/auth/logout');

		expect(response.status).toBe(302);
		expect(response.header.location).toBe('/auth/login');

		const cookies = response.headers['set-cookie'];
		expect(cookies).toBeDefined();
		expect(cookies.some((cookie) => cookie.includes('token=;'))).toBe(true);
	});

	// Close the database connection after all tests
	afterAll(async () => {
		await sequelize.close();
	});
});
