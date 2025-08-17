const mongoose = require('mongoose');

const SellProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  dateOfSale: {
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
      amount: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('SellProduct', SellProductSchema);
