const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_board_api', 'wook', 'wook', {
  host: 'localhost',
  dialect: 'mysql'
});
const User = sequelize.define('user', {
  name: Sequelize.STRING,
  password: Sequelize.STRING
});

module.exports = {
  sequelize: sequelize,
  User: User
}
