const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  descr: String,
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  comment: {
    right: String,
    wrong: String
  },
  fact: String
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);