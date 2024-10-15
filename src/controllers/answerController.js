const Answer = require('../models/Answer');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { checkAnswer } = require('../utils/checkAnswers');

exports.submitAnswer = asyncHandler(async (req, res) => {
  try {
    const { userId, questionId, options, timeSpent } = req.body;

    const checkedData = await checkAnswer(questionId, options, timeSpent);

    // Проверяем, существует ли уже ответ на этот вопрос
    const existingAnswer = await Answer.findOne({ userId, questionId });

    if (existingAnswer) {
      // Если существующий ответ лучше или равен новому, возвращаем его
      // if (existingAnswer.score >= checkedData.score) {
      //   return successResponse(res, {
      //     ...existingAnswer.toObject(),
      //     message: 'Сохранен лучший предыдущий ответ'
      //   });
      // }
      // Удаляем старый ответ
      await Answer.findByIdAndDelete(existingAnswer._id);
    }

    // Создаем новый ответ
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

    successResponse(res, {
      ...newAnswer.toObject(),
      message: existingAnswer ? 'Сохранен новый лучший ответ' : 'Ответ сохранен'
    }, 201);

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