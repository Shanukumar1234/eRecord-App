const mongoose = require('mongoose');

const LabourCostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  labourName: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  costAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LabourCost', LabourCostSchema);
