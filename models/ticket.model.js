const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');

const Ticket = sequelize.define('Ticket', {
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	status: {
		type: DataTypes.ENUM('open', 'closed'),
		defaultValue: 'open',
	},
});

Ticket.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

module.exports = Ticket;
