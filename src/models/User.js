const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String },
  phone: { type: String },
  lastname: { type: String },
  firstname: { type: String },
  patronymic: { type: String },
  workplace: { type: String },
  position: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);