const express = require('express');
const router = express.Router();
const SellProduct = require('../models/SellProduct');
const authMiddleware = require('../middleware/authMiddleware');

// Add a sell product record
router.post('/add', authMiddleware, async (req, res) => {
  const { buyerName, dateOfSale, paymentMethod, chequeNumber, items, totalAmount } = req.body;

  try {
    if (paymentMethod === 'cheque' && !chequeNumber) {
      return res.status(400).json({ message: 'Cheque number required when payment method is cheque' });
    }

    const sellProduct = new SellProduct({
      user: req.user.id,
      buyerName,
      dateOfSale,
      paymentMethod,
      chequeNumber: paymentMethod === 'cheque' ? chequeNumber : undefined,
      items,
      totalAmount
    });

    await sellProduct.save();
    res.status(201).json({ message: 'Sell product record added', sellProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sell product records for logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const records = await SellProduct.find({ user: req.user.id }).sort({ dateOfSale: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a sell product record by ID
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { buyerName, dateOfSale, paymentMethod, chequeNumber, items, totalAmount } = req.body;

  try {
    let record = await SellProduct.findOne({ _id: req.params.id, user: req.user.id });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    if (paymentMethod === 'cheque' && !chequeNumber) {
      return res.status(400).json({ message: 'Cheque number required when payment method is cheque' });
    }

    record.buyerName = buyerName;
    record.dateOfSale = dateOfSale;
    record.paymentMethod = paymentMethod;
    record.chequeNumber = paymentMethod === 'cheque' ? chequeNumber : undefined;
    record.items = items;
    record.totalAmount = totalAmount;

    await record.save();
    res.json({ message: 'Record updated', record });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a sell product record by ID
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const result = await SellProduct.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

