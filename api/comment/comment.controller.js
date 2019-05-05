const models = require('../../models');

const errFn = (err, res) => {
  const status = err.status ? err.status : 400;
  const message = err.message ? err.message : 'Bad request';
  return res.status(status).json({error: message});
};
const findCommentByPk = pk => {
  return new Promise((resolve, reject) => {
    const _pk = Number(pk);
    if (!_pk) throw {status:403, message: 'Id should be number'};
    resolve(_pk);
  }).then(pk => {
    return models.Comment.findByPk(pk);
  }).then(comment => {
    if (!comment) throw {status:404, message: 'Invalid id'};
    return comment;
  });
};

module.exports = {
  list(req, res){
    return models.Comment.findAll().then(comments => res.json(comments));
  },
  create(req, res){
    const comment = req.body["comment"];
    const userId = Number(req.body["userId"]);
    const postId = Number(req.body["postId"]);

    return new Promise((resolve, reject) => {
      if (!comment || !postId || !userId) throw {status:400, message: 'Invalid data'};
      resolve();
    }).then(() =>{
      return models.User.findByPk(userId);
    }).then(user => {
      if (!user) throw {status:404, message: 'User not found'};
      return models.Post.findByPk(postId);
    }).then(post => {
      if (!post) throw {status:404, message: 'Post not found'};
      return models.Comment.create({ comment, userId, postId, });
    }).then(cmt => {
        res.status(201).json(cmt);
    }).catch(err => errFn(err, res));
  },
  update(req, res){
    const id = Number(req.body["id"]);
    const userId = Number(req.body["userId"]);
    const comment = req.body["comment"];
    const cdata = {};

    cdata["id"] = id;
    if (userId) cdata["userId"] = userId;
    if (comment) cdata["comment"] = comment;

    // update only return count of update, 1
    return new Promise((resolve, reject) => {
      if (!id || !userId) throw {status:400, message: 'Invalid data'};
      resolve();
    }).then(() =>{
      return findCommentByPk(id);
    }).then(comment =>{
      if (comment.userId !== userId) throw {status:401, message: 'Unauthorized'};
      return models.Comment.update(cdata, { where: {id: comment.id} });
    }).then(() => {
      return res.status(201).end();
    }).catch(err => errFn(err, res));
  },
  retrieve(req, res){
    return findCommentByPk(req.params.id).then(comment => {
      return res.json(comment);
    }).catch(err => errFn(err, res));
  },
  delete(req, res){
    return findCommentByPk(req.params.id).then(comment => {
      return models.Comment.destroy({ where: {id: comment.id} });
    }).then(() => {
      return res.status(204).send();
    }).catch(err => errFn(err, res));
  }
}
