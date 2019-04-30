const models = require('../../models');
const errFn = (err, res) => {
  const status = err.status ? err.status : 400;
  const message = err.message ? err.message : 'Bad request';
  return res.status(status).json({error: message});
};


module.exports = {
  list(req, res){
    models.Comment.findAll().then(comments => res.json(comments));
  },
  create(req, res){
    const comment = req.body["comment"];
    const userId = Number(req.body["userId"]);
    const postId = Number(req.body["postId"]);

    if (!comment || !postId || !userId) {
      return res.status(400).json({error: 'invalid data'});
    }

    return models.User.findByPk(userId).then(user => {
      if (!user) throw {status:404, message: 'User not found'};
      return models.Post.findByPk(postId);
    }).then(post => {
      if (!post) throw {status:404, message: 'Post not found'};
      return models.Comment.create({
        comment,
        userId,
        postId,
      });
    }).then(cmt => {
        res.status(201).json(cmt);
    }).catch(err => errFn(err, res));
  },
  update(req, res){
    const id = Number(req.body["id"]);
    const userId = Number(req.body["userId"]);
    const postId = Number(req.body["postId"]);
    const comment = req.body["comment"];
    const cdata = {};

    if (!id) {
      return res.status(404).json({error: 'Comment not found'});
    }

    cdata["id"] = id;
    if (userId) cdata["userId"] = userId;
    if (postId) cdata["postId"] = postId;
    if (comment) cdata["comment"] = comment;

    // update only return count of update, 1
    return models.Comment.update(cdata, {
      where: {id}
    }).then(() => {
      return res.status(201).end();
    }).catch(err => errFn(err, res));
  },
  retrieve(req, res){
    const id = Number(req.params.id);

    // ex) 0, NaN ...
    if (!id) return res.status(400).json({error: 'invalid data'});

    return models.Comment.findByPk(id).then(comment => {
      if (!comment) throw {status:404, message: 'Comment not found'};
      return res.json(comment);
    }).catch(err => errFn(err, res));
  },
  delete(req, res){
    const id = Number(req.params.id);
    if (!id) {
      return res.status(404).json({error: 'Comment not found'});
    }
    return models.Comment.destroy({
      where: {id}
    }).then(() => {
      return res.status(204).send();
    }).catch(err => errFn(err, res));
  }
}
