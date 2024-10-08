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