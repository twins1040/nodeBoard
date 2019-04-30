const models = require('../../models');

module.exports = {
  list(req, res){
    models.User.findAll().then(users => res.json(users));
  },
  create(req, res){
    const name = req.body["name"];
    const password = req.body["password"];

    if (!name || !password) {
      return res.status(400).json({error: 'invalid data'});
    }

    // if name is duplicated, return error
    models.User.count({where: {name: name}}).then(number => {
      if (number !== 0) {
        throw {status:400, message: 'duplicated'};
      }
    }).then(() => {
      // Add data to users object
      return models.User.create({
        name: name,
        password: password
      }).then((user) => {
        res.status(201).json(user);
      });
    }).catch(err => {
      const status = err.status ? err.status : 400;
      const message = err.message ? err.message : 'Bad request';
      return res.status(status).json({error: message});
    });
  },
  retrieve(req, res){
    return new Promise((resolve, reject) => {
      const pk = Number(req.params.id);
      if (!pk) throw {status:404, message: 'Id should be number'};
      resolve(pk);
    }).then(pk => {
      return models.User.findByPk(pk);
    }).then(user => {
      if (!user) throw {status:404, message: 'Invalid id'};
      return res.json(user);
    }).catch(err => {
      const status = err.status ? err.status : 400;
      const message = err.message ? err.message : 'Bad request';
      return res.status(err.status).json({error: err.message});
    });
  },
  posts(req,res){
    const pk = Number(req.params.id);
    return new Promise((resolve, reject) => {
      if (!pk) throw {status:404, message: 'Id should be number'};
      resolve(pk);
    }).then(pk => {
      return models.User.findByPk(pk);
    }).then(user => {
      if (!user) throw {status:404, message: 'Invalid id'};
      return models.Post.findAll({
        where: {
          userId: pk
        }});
    }).then(posts => {
      return res.json(posts);
    }).catch(err => {
      const status = err.status ? err.status : 400;
      const message = err.message ? err.message : 'Bad request';
      return res.status(err.status).json({error: err.message});
    });
  },
  comments(req,res){
    const pk = Number(req.params.id);
    return new Promise((resolve, reject) => {
      if (!pk) throw {status:404, message: 'Id should be number'};
      resolve(pk);
    }).then(pk => {
      return models.User.findByPk(pk);
    }).then(user => {
      if (!user) throw {status:404, message: 'Invalid id'};
      return models.Comment.findAll({
        where: {
          userId: pk
        }});
    }).then(comments => {
      return res.json(comments);
    }).catch(err => {
      const status = err.status ? err.status : 400;
      const message = err.message ? err.message : 'Bad request';
      return res.status(err.status).json({error: err.message});
    });
  }
}
