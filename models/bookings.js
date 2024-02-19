// Import Sequelize library
const { Sequelize, DataTypes } = require('sequelize');
// Import database connection
const sequelize = require('../db');

// Define Booking model
const Booking = sequelize.define('Booking', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  zip: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  // Define table name (optional)
  tableName: 'bookings',
  // Disable default timestamps (createdAt, updatedAt)
  timestamps: false
});

// Export Booking model
module.exports = Booking;