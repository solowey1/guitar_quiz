const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  descr: { type: String },
  options: [{
    text: { type: String },
    isCorrect: Boolean
  }],
  comment: {
    right: { type: String },
    wrong: { type: String }
  },
  fact: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);