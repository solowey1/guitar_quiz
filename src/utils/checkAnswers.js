const Question = require('../models/Question');

const calculateScore = (correctAnswers, totalQuestions, timeSeconds) => {
  const maxPointsPerQuestion = 1000;
  const averageCompleteness = correctAnswers.reduce((sum, val) => sum + val, 0) /
    totalQuestions.reduce((sum, val) => sum + val, 0);

  const answerPoints = correctAnswers.reduce((sum, correct, index) => {
    return sum + (correct / totalQuestions[index]) * maxPointsPerQuestion;
  }, 0);

  const completenessBonus = averageCompleteness * 10000;
  const finalScore = answerPoints + completenessBonus - timeSeconds;

  return finalScore;
};

exports.checkAnswers = async (answers, timeSpent) => {
  let totalCorrect = 0;
  let totalQuestions = answers.length;
  let correctAnswersArray = [];
  let totalQuestionsArray = [];

  const checkedAnswers = await Promise.all(answers.map(async (answer) => {
    const question = await Question.findById(answer.questionId);
    if (!question) {
      throw new Error(`Вопрос с ID ${answer.questionId} не найден`);
    }

    const correctOptions = question.options
      .map((option, index) => option.isCorrect ? index : -1)
      .filter(index => index !== -1);

    const isFullyCorrect = JSON.stringify(answer.selectedOptions.sort()) === JSON.stringify(correctOptions.sort());
    const partialScore = answer.selectedOptions.filter(option => correctOptions.includes(option)).length / correctOptions.length;

    totalCorrect += isFullyCorrect ? 1 : 0;
    correctAnswersArray.push(partialScore * correctOptions.length);
    totalQuestionsArray.push(correctOptions.length);

    return {
      ...answer,
      correctOptions,
      isFullyCorrect,
      partialScore
    };
  }));

  const score = calculateScore(correctAnswersArray, totalQuestionsArray, timeSpent);

  return {
    answers: checkedAnswers,
    totalCorrect,
    totalQuestions,
    score
  };
};