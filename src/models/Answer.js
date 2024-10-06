const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  userAnswers: [String],
  correctAnswers: [String],
  correctCount: Number,
  totalCorrect: Number,
  isFullyCorrect: Boolean,
  score: Number,
  timeSpent: Number
}, {
  timestamps: true
});

AnswerSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('Answer', AnswerSchema);