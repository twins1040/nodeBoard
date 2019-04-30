const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_board_api', 'wook', 'wook', {
  host: 'localhost',
  dialect: 'mysql'
});
const User = sequelize.define('user', {
  name: Sequelize.STRING,
  password: Sequelize.STRING
});
const Post = sequelize.define('post', {
  title: Sequelize.STRING,
  description: Sequelize.STRING
});
const Comment = sequelize.define('comment', {
  comment: Sequelize.STRING,
});

User.hasMany(Post);
User.hasMany(Comment);
Post.hasMany(Comment);
Post.belongsTo(User);
Comment.belongsTo(User);
Comment.belongsTo(Post);

module.exports = {
  sequelize,
  User,
  Post,
  Comment
}
