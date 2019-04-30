const express = require('express');
const router = express.Router();
const controller = require('./post.controller');

router.get('/', controller.list);
router.post('/', controller.create);
router.put('/', controller.update);
router.get('/:id', controller.retrieve);
router.delete('/:id', controller.delete);
router.get('/:id/comments', controller.comments);

module.exports = router;
