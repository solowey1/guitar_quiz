const UserAnswer = require('../models/UserAnswer');
const asyncHandler = require('../utils/asyncHandler');

exports.submitAnswer = asyncHandler(async (req, res) => {
  const userAnswer = await UserAnswer.create(req.body);
  res.status(201).json({
    success: true,
    data: userAnswer
  });
});

exports.getUserAnswers = asyncHandler(async (req, res) => {
  const userAnswers = await UserAnswer.find({ userId: req.params.userId })
    .populate('userId', 'firstname lastname email')
    .populate('quizId', 'title');
  res.status(200).json({
    success: true,
    count: userAnswers.length,
    data: userAnswers
  });
});