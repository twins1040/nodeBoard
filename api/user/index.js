const express = require('express');
const router = express.Router();
const controller = require('./user.controller');

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.retrieve);

module.exports = router;
