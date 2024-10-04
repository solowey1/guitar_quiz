const mongoose = require('mongoose');

const UserAnswerSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOptions: [Number],
    isFullyCorrect: Boolean
  }],
  totalCorrect: Number,
  timeSpent: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('UserAnswer', UserAnswerSchema);