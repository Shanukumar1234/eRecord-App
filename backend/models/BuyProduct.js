const mongoose = require('mongoose');

const BuyProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: {
    type: String,
    required: true
  },
  dateOfBuy: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque'],
    required: true
  },
  chequeNumber: {
    type: String,
    required: function() { return this.paymentMethod === 'cheque'; }
  },
  items: [
    {
      itemName: { type: String, required: true },
      amount: { type: Number, required: true },
      weight: { type: Number }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('BuyProduct', BuyProductSchema);
