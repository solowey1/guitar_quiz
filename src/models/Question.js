const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  title: { type: String, required: true, set: v => v.trim() },
  descr: { type: String, set: v => v.trim() },
  options: [{
    text: { type: String, set: v => v.trim() },
    isCorrect: Boolean
  }],
  comment: {
    right: { type: String, set: v => v.trim() },
    wrong: { type: String, set: v => v.trim() }
  },
  fact: { type: String, set: v => v.trim() }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);