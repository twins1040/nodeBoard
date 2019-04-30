const models = require('../../models');
const errFn = (err, res) => {
  const status = err.status ? err.status : 400;
  const message = err.message ? err.message : 'Bad request';
  return res.status(status).json({error: message});
};


module.exports = {
  list(req, res){
    models.Post.findAll().then(posts => res.json(posts));
  },
  create(req, res){
    const title = req.body["title"];
    const description = req.body["description"];
    const userId = Number(req.body["userId"]);

    if (!title || !description || !userId) {
      return res.status(400).json({error: 'invalid data'});
    }

    return models.User.findByPk(userId).then(user => {
      if (!user) throw {status:404, message: 'User not found'};
      return models.Post.create({
        title,
        description,
        userId
      });
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

    if (!id) {
      return res.status(404).json({error: 'Post not found'});
    }

    udata["id"] = id;
    if (userId) udata["userId"] = userId;
    if (title) udata["title"] = title;
    if (description) udata["description"] = description;

    // update only return count of update, 1
    return models.Post.update(udata, {
      where: {id}
    }).then(() => {
      return res.status(201).end();
    }).catch(err => errFn(err, res));
  },
  retrieve(req, res){
    const id = Number(req.params.id);

    // ex) 0, NaN ...
    if (!id) return res.status(400).json({error: 'invalid data'});

    return models.Post.findByPk(id).then(post => {
      if (!post) throw {status:404, message: 'User not found'};
      return res.json(post);
    }).catch(err => errFn(err, res));
  },
  delete(req, res){
    const id = Number(req.params.id);
    if (!id) {
      return res.status(404).json({error: 'Post not found'});
    }
    return models.Post.destroy({
      where: {id}
    }).then(() => {
      return res.status(204).send();
    }).catch(err => errFn(err, res));
  }
}
