const Sequelize = require('Sequelize');
module.exports = (sequelize) => {
    return  sequelize.define('Message', {
        message: {
            type: Sequelize.STRING
        }
    })
}