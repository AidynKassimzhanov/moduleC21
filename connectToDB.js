const { Sequelize } = require("sequelize");
const sequelize = require("./db");

const connectToDB = async () => {

    try {
        await sequelize.authenticate();

        console.log('Соединение установлено успешно.');

        // Синхронизация модели с базой данных
        await sequelize.sync();

        
        } catch (error) {
            console.error('Ошибка:', error);
        } 
        // finally {
        //     // Закрытие соединения с базой данных
        //     // await sequelize.close();
        //     console.log('Соединение закрыто.');
        // }
        
}

module.exports = connectToDB