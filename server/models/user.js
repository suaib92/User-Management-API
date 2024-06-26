const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  skills: {
    type: [String],
  },
  about: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
