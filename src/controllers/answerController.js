import Answer from '../models/Answer';
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { checkAnswers } = require('../utils/checkAnswers');

exports.submitAnswer = asyncHandler(async (req, res) => {
  try {
    const { userId, quizId, answers, timeSpent } = req.body;

    const checkedData = await checkAnswers(answers, timeSpent);

    const Answer = await Answer.create({
      userId,
      quizId,
      answers: checkedData.answers,
      totalCorrect: checkedData.totalCorrect,
      totalQuestions: checkedData.totalQuestions,
      score: checkedData.score,
      timeSpent
    });

    successResponse(res, Answer, 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.getUserAnswers = asyncHandler(async (req, res) => {
  try {
    const Answers = await Answer.find({ userId: req.params.userId })
      .populate('userId', 'firstname lastname email')
      .populate('quizId', 'title');

    successResponse(res, {
      count: Answers.length,
      data: Answers
    });
  } catch (error) {
    errorResponse(res, error.message);
  }
});