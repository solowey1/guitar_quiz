const express = require('express');
const {
  submitAnswer,
  getUserAnswers
} = require('../controllers/userAnswerController');

const router = express.Router();

router.route('/')
  .post(submitAnswer);

router.route('/user/:userId')
  .get(getUserAnswers);

module.exports = router;