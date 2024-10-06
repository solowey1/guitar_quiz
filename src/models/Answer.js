const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  userAnswers: [{ type: String }],
  correctAnswers: [{ type: String }],
  correctCount: { type: Number, min: 0 },
  totalCorrect: { type: Number, min: 0 },
  isFullyCorrect: Boolean,
  score: Number,
  timeSpent: { type: Number, min: 0 }
}, {
  timestamps: true
});

AnswerSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('Answer', AnswerSchema);