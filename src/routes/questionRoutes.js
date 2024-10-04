const express = require('express');
const controller = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(controller.getQuestions)
  .post(controller.createQuestion);

router.route('/:id')
  .get(controller.getQuestion)
  .put(protect, controller.updateQuestion)
  .delete(protect, controller.deleteQuestion);

router.route('/number/:number')
  .get(controller.getQuestionByNumber);

module.exports = router;