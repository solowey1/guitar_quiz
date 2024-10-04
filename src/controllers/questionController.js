const Question = require('../models/Question');
const asyncHandler = require('../utils/asyncHandler');

exports.createQuestion = asyncHandler(async (req, res) => {
  const lastQuestion = await Question.findOne().sort('-number');
  const newNumber = lastQuestion ? lastQuestion.number + 1 : 1;

  const question = await Question.create({
    ...req.body,
    number: newNumber
  });

  res.status(201).json({
    success: true,
    data: question
  });
});

exports.getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find().sort('number');
  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions
  });
});

exports.getQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Вопрос не найден'
    });
  }
  res.status(200).json({
    success: true,
    data: question
  });
});

exports.getQuestionByNumber = asyncHandler(async (req, res) => {
  const question = await Question.findOne({ number: req.params.number });
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Вопрос не найден'
    });
  }
  res.status(200).json({
    success: true,
    data: question
  });
});

exports.updateQuestion = asyncHandler(async (req, res) => {
  let question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Вопрос не найден'
    });
  }
  question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: question
  });
});

exports.deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Вопрос не найден'
    });
  }
  await question.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});