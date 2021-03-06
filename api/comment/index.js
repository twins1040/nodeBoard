const express = require('express');
const router = express.Router();
const controller = require('./comment.controller');

router.get('/', controller.list);
router.post('/', controller.create);
router.put('/', controller.update);
router.get('/:id', controller.retrieve);
router.delete('/:id', controller.delete);

module.exports = router;
