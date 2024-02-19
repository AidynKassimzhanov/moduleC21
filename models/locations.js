const { Sequelize, DataTypes } = require('sequelize');
const  sequelize  = require('../db');


const Location = sequelize.define('Location', {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
    timestamps: false
});

module.exports = Location