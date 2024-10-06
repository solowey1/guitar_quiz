const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true, unique: true, set: v => v.trim() },
  phone: { type: String, required: true, set: v => v.trim() },
  lastname: { type: String, required: true, set: v => v.trim() },
  firstname: { type: String, required: true, set: v => v.trim() },
  patronymic: { type: String, set: v => v.trim() },
  workplace: { type: String, set: v => v.trim() },
  position: { type: String, set: v => v.trim() }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);