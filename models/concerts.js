const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Location = require('./locations');

const Concert = sequelize.define('Concert', {
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location_id: {
        type: DataTypes.INTEGER, // Используйте правильный тип данных
        allowNull: false
      }
  }, {
    timestamps: false,
    foreignKey: 'location_id'
  });

Concert.belongsTo(Location);

module.exports = Concert