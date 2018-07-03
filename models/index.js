var Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './chat.sqlite'
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    }, (err) => {
        console.log('Unable to connect to the database:', err);
});

var models = [
    'Message',
    'User'
];

models.forEach((model) => {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function(m) {
    m.Message.belongsTo(m.User);
    m.User.hasMany(m.Message);
})(module.exports);

module.exports.sequelize = sequelize;