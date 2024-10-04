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

router.get('/', getQuestions)
router.post('/', protect, createQuestion);

router.get('/:id', getQuestion)
router.put('/:id', protect, updateQuestion)
router.delete('/:id', protect, deleteQuestion);

router.get('/number/:number', getQuestionByNumber);

module.exports = router;