const mongoose = require('mongoose');

const HouseholdExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the user who created this entry
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Groceries', 'Utilities', 'Rent', 'Maintenance', 'Other']
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HouseholdExpense', HouseholdExpenseSchema);
