const Answer = require('../models/Answer');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { checkAnswer } = require('../utils/checkAnswers');

exports.submitAnswer = asyncHandler(async (req, res) => {
  try {
    const { userId, questionId, answers, timeSpent } = req.body;

    const checkedData = await checkAnswer(questionId, answers, timeSpent);

    const newAnswer = await Answer.create({
      userId,
      questionId,
      userAnswers: checkedData.userAnswers,
      correctAnswers: checkedData.correctAnswers,
      correctCount: checkedData.correctCount,
      totalCorrect: checkedData.totalCorrect,
      isFullyCorrect: checkedData.isFullyCorrect,
      score: checkedData.score,
      timeSpent
    });

    successResponse(res, newAnswer, 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.getUserAnswers = asyncHandler(async (req, res) => {
  try {
    const answers = await Answer.find({ userId: req.params.userId })
      .populate('userId', 'firstname lastname email')
      .populate('questionId', 'number title');

    successResponse(res, {
      count: answers.length,
      data: answers
    });
  } catch (error) {
    errorResponse(res, error.message);
  }
});