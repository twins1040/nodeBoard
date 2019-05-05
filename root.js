const models = require('./models');

// The root provides a resolver function for each API endpoint
module.exports = {
  user: (args) => {
    return models.User.findByPk(args.id, { include: [models.Post, models.Comment] });
  },
  post: (args) => {
    return models.Post.findByPk(args.id, { include: [models.Comment] });
  },
  comment: (args) => {
    return models.Post.findByPk(args.id);
  },
};

