const models = require('./models');

// The root provides a resolver function for each API endpoint
module.exports = {
  user: (args) => {
    return models.User.findByPk(args.id, {
      include: { model: models.Post }
    });
  },
  post: (args) => {
    return models.Post.findByPk(args.id, {
      include: { model: models.Comment }
    });
  },
  comment: (args) => {
    return models.Post.findByPk(args.id);
  },
};

