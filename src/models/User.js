const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  patronymic: { type: String },
  workplaceOrSchool: { type: String },
  position: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);