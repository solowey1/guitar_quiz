const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  text: { type: String, required: true },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  difficulty: String
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);