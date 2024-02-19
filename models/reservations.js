// Import Sequelize library
const { Sequelize, DataTypes } = require('sequelize');
// Import database connection
const sequelize = require('../db');

// Define Reservation model
const Reservation = sequelize.define('Reservation', {
  token: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  // Define table name (optional)
  tableName: 'reservations',
  // Disable default timestamps (createdAt, updatedAt)
  timestamps: false
});

// Export Reservation model
module.exports = Reservation;