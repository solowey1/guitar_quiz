const express = require('express');
const controller = require('../controllers/answerController');

const router = express.Router();

router.route('/')
  .post(controller.submitAnswer);

router.route('/user/:userId')
  .get(controller.getUserAnswers);

module.exports = router;