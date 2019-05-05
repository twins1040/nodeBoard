const models = require('../../models');
const paginate = require('express-paginate');

const errFn = (err, res) => {
  const status = err.status ? err.status : 400;
  const message = err.message ? err.message : 'Bad request';
  return res.status(status).json({error: message});
};
const findPostByPk = pk => {
  return new Promise((resolve, reject) => {
    const _pk = Number(pk);
    if (!_pk) throw {status:403, message: 'Id should be number'};
    resolve(_pk);
  }).then(pk => {
    return models.Post.findByPk(pk);
  }).then(post => {
    if (!post) throw {status:404, message: 'Invalid id'};
    return post;
  });
};

module.exports = {
  list(req, res, next){
    return models.Post.findAndCountAll({limit: req.query.limit, offset: req.skip})
      .then(results => {
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);
        return res.json({
          data: results.rows,
          pageCount,
          itemCount,
          pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
        });
    }).catch(err => next(err))
  },
  create(req, res){
    const title = req.body["title"];
    const description = req.body["description"];
    const userId = Number(req.body["userId"]);

    return new Promise((resolve, reject) => {
      if (!title || !description || !userId){
        throw {status:400, message: 'Invalid data'};
      }
      resolve();
    }).then(() =>{
      return models.User.findByPk(userId);
    }).then(user => {
        if (!user) throw {status:404, message: 'User not found'};
        return models.Post.create({ title, description, userId });
    }).then(post => {
      return res.status(201).json(post);
    }).catch(err => errFn(err, res));
  },
  update(req, res){
    const id = Number(req.body["id"]);
    const userId = Number(req.body["userId"]);
    const title = req.body["title"];
    const description = req.body["description"];
    const udata = {};

    udata["id"] = id;
    if (userId) udata["userId"] = userId;
    if (title) udata["title"] = title;
    if (description) udata["description"] = description;

    return new Promise((resolve, reject) => {
      if (!id || !userId ) throw {status:400, message: 'Invalid data'};
      resolve();
    }).then(() =>{
      return findPostByPk(id);
    }).then(post =>{
      if (post.userId !== userId) throw {status:401, message: 'Unauthorized'};
      return models.Post.update(udata, { where: {id} });
    }).then(() => {
      // update only return count of update, 1
      return res.status(201).end();
    }).catch(err => errFn(err, res));
  },
  retrieve(req, res){
    return findPostByPk(req.params.id).then(post => {
      return res.json(post);
    }).catch(err => errFn(err, res));
  },
  delete(req, res){
    return findPostByPk(req.params.id).then(post => {
      return models.Post.destroy({ where: {id: post.id} });
    }).then(() => {
      return res.status(204).send();
    }).catch(err => errFn(err, res));
  },
  comments(req,res){
    return findPostByPk(req.params.id).then(post => {
      return models.Comment.findAll({ where: { postId: post.id }});
    }).then(comments => {
      return res.json(comments);
    }).catch(err => errFn(err, res));
  }
}
