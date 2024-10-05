const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOptions: [Number],
    correctOptions: [Number],
    isFullyCorrect: Boolean,
    partialScore: Number
  }],
  totalCorrect: Number,
  totalQuestions: Number,
  score: Number,
  timeSpent: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Answer', AnswerSchema);