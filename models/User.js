const mongoose = require('mongoose');
const model = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 3,
    trim: true
  },
  email: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 6,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
}));

module.exports = model;