const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
  refreshToken: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('User', userSchema);
