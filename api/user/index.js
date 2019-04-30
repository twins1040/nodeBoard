const express = require('express');
const router = express.Router();
const controller = require('./user.controller');

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.retrieve);
router.get('/:id/posts', controller.posts);
router.get('/:id/comments', controller.comments);

module.exports = router;
