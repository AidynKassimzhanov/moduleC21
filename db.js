const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)

// const sequelize = new Sequelize(
//     'wsk_21',
//     'root',
//     '',
//     {
//         dialect: 'mysql',
//         host: 'localhost',
//         port: '3307'
//     }
// )

module.exports = sequelize