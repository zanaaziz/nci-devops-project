const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
	email: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	role: {
		type: DataTypes.ENUM('admin', 'user'),
		defaultValue: 'user',
	},
});

module.exports = User;
