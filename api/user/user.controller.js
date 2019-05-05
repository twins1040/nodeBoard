const models = require('../../models');

const errFn = (err, res) => {
  const status = err.status ? err.status : 400;
  const message = err.message ? err.message : 'Bad request';
  return res.status(status).json({error: message});
}
const findUserByPk = pk => {
  return new Promise((resolve, reject) => {
    const _pk = Number(pk);
    if (!_pk) throw {status:403, message: 'Id should be number'};
    resolve(_pk);
  }).then(pk => {
    return models.User.findByPk(pk);
  }).then(user => {
    if (!user) throw {status:404, message: 'Invalid id'};
    return user;
  });
};

module.exports = {
  list(req, res){
    return models.User.findAll().then(users => res.json(users));
  },
  create(req, res){
    const name = req.body["name"];
    const password = req.body["password"];

    return new Promise((resolve, reject) => {
      if (!name || !password) throw {status:400, message: 'Invalid data'};
      resolve();
    }).then(() =>{
      return models.User.count({ where: {name: name} });
    }).then(number => {
      // if name is duplicated, return error
      if (number !== 0) throw {status:400, message: 'duplicated'};
      // Add data to users object
      return models.User.create({name: name, password: password});
    }).then(user => {
      return res.status(201).json(user);
    }).catch(err => errFn(err, res));
  },
  retrieve(req, res){
    return findUserByPk(req.params.id).then(user => {
      return res.json(user);
    }).catch(err => errFn(err, res));
  },
  posts(req,res){
    return findUserByPk(req.params.id).then(user => {
      return models.Post.findAll({ where: { userId: user.id }});
    }).then(posts => {
      return res.json(posts);
    }).catch(err => errFn(err, res));
  },
  comments(req,res){
    return findUserByPk(req.params.id).then(user => {
      return models.Comment.findAll({ where: { userId: user.id }});
    }).then(comments => {
      return res.json(comments);
    }).catch(err => errFn(err, res));
  }
}
