const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Booking = require('./bookings');

const Ticket = sequelize.define('CoTicketcert', {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    booking_id: {
        type: DataTypes.INTEGER, // Используйте правильный тип данных
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
    }, {
      // Define table name (optional)
      tableName: 'tickets',
      foreignKey: 'booking_id',
      // Disable default timestamps (createdAt, updatedAt)
      timestamps: false
    });

Ticket.belongsTo(Booking);

module.exports = Ticket