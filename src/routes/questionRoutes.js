const express = require('express');
const {
  createQuestion,
  getQuestions,
  getQuestion,
  getQuestionByNumber,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getQuestions)
router.route('/').post(protect, createQuestion);

router.route('/:id').get(getQuestion)
router.route('/:id').put(protect, updateQuestion)
router.route('/:id').delete(protect, deleteQuestion);

router.route('/number/:number').get(getQuestionByNumber);

module.exports = router;