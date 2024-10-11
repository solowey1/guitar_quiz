const Question = require('../models/Question');
const asyncHandler = require('../utils/asyncHandler');
const { checkAuthorization } = require('../utils/checkAuthorization');
const { shuffleArray } = require('../utils/helpers');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const processQuestion = (question, isAuthorized, isRandom = false) => {
  const processedQuestion = question.toObject();

  if (!isAuthorized) {
    processedQuestion.options = processedQuestion.options.map(option => ({
      text: option.text,
    }));
    return processedQuestion;
  }

  if (isRandom) {
    processedQuestion.options = shuffleArray(processedQuestion.options);
  }

  return processedQuestion;
};

exports.createMultipleQuestions = asyncHandler(async (req, res) => {
  try {
    let questionsData = req.body;

    // Проверяем, не обернуты ли данные дополнительно в объект
    if (!Array.isArray(questionsData) && questionsData.questions && Array.isArray(questionsData.questions)) {
      questionsData = questionsData.questions;
    }

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return errorResponse(res, 'Invalid input: expected non-empty array of questions', 400);
    }

    const lastQuestion = await Question.findOne().sort('-number');
    let newNumber = lastQuestion ? lastQuestion.number : 0;

    const createdQuestions = await Promise.all(questionsData.map(async (questionData) => {
      // Проверяем наличие обязательных полей
      if (!questionData.title || !questionData.options) {
        throw new Error(`Invalid question data: missing title or options for question ${JSON.stringify(questionData)}`);
      }

      newNumber++; // Увеличиваем номер перед созданием вопроса

      const question = new Question({
        ...questionData,
        number: newNumber
      });

      // Явно устанавливаем поля модели
      if (questionData.comment) question.comment = questionData.comment;
      if (questionData.descr) question.descr = questionData.descr;
      if (questionData.fact) question.fact = questionData.fact;

      await question.save();
      return question;
    }));

    successResponse(res, createdQuestions, 201);
  } catch (error) {
    console.error('Error in createMultipleQuestions:', error);
    errorResponse(res, error.message, 500);
  }
});

exports.createQuestion = asyncHandler(async (req, res) => {
  try {
    const lastQuestion = await Question.findOne().sort('-number');
    const newNumber = lastQuestion ? lastQuestion.number + 1 : 1;

    const question = await Question.create({
      ...req.body,
      number: newNumber
    });

    successResponse(res, question, 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.getQuestions = asyncHandler(async (req, res) => {
  try {
    const isAuthorized = checkAuthorization(req);
    const isRandom = 'random' in req.query;
    const questions = await Question.find().sort('number');
    const processedQuestions = questions.map(question =>
      processQuestion(question, isAuthorized, isRandom)
    );

    successResponse(res, processedQuestions);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.getQuestion = asyncHandler(async (req, res) => {
  try {
    const isAuthorized = checkAuthorization(req);
    const isRandom = 'random' in req.query;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }

    const processedQuestion = processQuestion(question, isAuthorized, isRandom);
    successResponse(res, processedQuestion);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.getQuestionByNumber = asyncHandler(async (req, res) => {
  try {
    const isAuthorized = checkAuthorization(req);
    const isRandom = 'random' in req.query;
    const question = await Question.findOne({ number: req.params.number });
    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }

    const processedQuestion = processQuestion(question, isAuthorized, isRandom);
    successResponse(res, processedQuestion);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.updateQuestion = asyncHandler(async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }
    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    successResponse(res, question);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

exports.deleteQuestion = asyncHandler(async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }
    await Question.deleteOne({ _id: req.params.id });
    successResponse(res, null, 204);
  } catch (error) {
    errorResponse(res, error.message);
  }
});