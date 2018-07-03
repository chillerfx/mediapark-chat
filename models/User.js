const Sequelize = require('Sequelize');
module.exports = (sequelize) => {
  return  sequelize.define('User', {
    name: {
      type: Sequelize.STRING
      }
  });
}
