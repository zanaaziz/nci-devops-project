const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'test') {
	sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: ':memory:',
		logging: false,
	});
} else {
	sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
		dialect: 'postgres',
		logging: false,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
	});
}

module.exports = sequelize;
