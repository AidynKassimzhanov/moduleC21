const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Reservation = require('./reservations');
const Ticket = require('./tickets');
const Row = require('./location_seat_rows');

const Seat = sequelize.define('Seat', {
    number: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    location_seat_row_id: {
        type: DataTypes.BIGINT, // Используйте правильный тип данных
        allowNull: false
    },
    reservation_id: {
        type: DataTypes.BIGINT, // Используйте правильный тип данных
        allowNull: true
    },
    ticket_id: {
        type: DataTypes.BIGINT, // Используйте правильный тип данных
        allowNull: true
    }
  }, {
    timestamps: false,
    foreignKey: 'location_seat_row_id',
    foreignKey: 'reservation_id',
    foreignKey: 'ticket_id',
    tableName: 'location_seats'
  });

Seat.belongsTo(Reservation);
Seat.belongsTo(Ticket);
Seat.belongsTo(Row);

module.exports = Seat