const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Concert = require('./concerts');

const Show = sequelize.define('Show', {
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    concert_id: {
        type: DataTypes.INTEGER, // Используйте правильный тип данных
        allowNull: false
      }
  }, {
    timestamps: false,
    foreignKey: 'concert_id'
  });

Show.belongsTo(Concert);

module.exports = Show