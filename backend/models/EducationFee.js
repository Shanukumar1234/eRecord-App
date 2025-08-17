const mongoose = require('mongoose');

const EducationFeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  childName: {
    type: String,
    required: true
  },
  classLevel: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  datePaid: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('EducationFee', EducationFeeSchema);
