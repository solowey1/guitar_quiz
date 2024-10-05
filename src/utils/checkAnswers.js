const Question = require('../models/Question');

const calculateScore = (correctCount, totalCorrect, timeSpent) => {
  const baseScore = 1000;
  const completeness = correctCount / totalCorrect;
  const timeMultiplier = Math.max(0, 1 - timeSpent / 120000); // 2 минуты максимум
  return Math.round(baseScore * completeness * timeMultiplier);
};

exports.checkAnswer = async (questionId, userAnswers, timeSpent) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new Error(`Вопрос с ID ${questionId} не найден`);
  }

  const correctAnswers = question.options
    .filter(option => option.isCorrect)
    .map(option => option.text);

  // Проверяем каждый ответ пользователя
  const correctCount = userAnswers.filter(answer =>
    correctAnswers.some(correctAnswer =>
      correctAnswer.toLowerCase() === answer.toLowerCase()
    )
  ).length;

  const isFullyCorrect = correctCount === correctAnswers.length && userAnswers.length === correctAnswers.length;

  const score = calculateScore(correctCount, correctAnswers.length, timeSpent);

  return {
    correctAnswers,
    userAnswers,
    correctCount,
    totalCorrect: correctAnswers.length,
    isFullyCorrect,
    score
  };
};