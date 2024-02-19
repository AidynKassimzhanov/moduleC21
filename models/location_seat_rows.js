const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Show = require('./shows');

const Row = sequelize.define('Row', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
        type: DataTypes.INTEGER, // Используйте правильный тип данных
        allowNull: false
      },
    show_id: {
        type: DataTypes.INTEGER, // Используйте правильный тип данных
        allowNull: false
      }
  }, {
    timestamps: false,
    foreignKey: 'show_id',
    tableName: 'location_seat_rows'
  });

Row.belongsTo(Show);

module.exports = Row