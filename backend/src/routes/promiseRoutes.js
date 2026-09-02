const express = require('express');
const router = express.Router();
const promiseController = require('../controllers/promiseController');

router.get('/', promiseController.getAll);
router.post('/', promiseController.create);
router.post('/:id/fulfill', promiseController.fulfill);
router.post('/:id/miss', promiseController.miss);

module.exports = router;
