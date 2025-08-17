const express = require('express');
const router = express.Router();
const BuyProduct = require('../models/BuyProduct');
const authMiddleware = require('../middleware/authMiddleware');

// Add a buy product record
router.post('/add', authMiddleware, async (req, res) => {
  const { farmerName, dateOfBuy, paymentMethod, chequeNumber, items, totalAmount } = req.body;

  try {
    if (paymentMethod === 'cheque' && !chequeNumber) {
      return res.status(400).json({ message: 'Cheque number required when payment method is cheque' });
    }

    const buyProduct = new BuyProduct({
      user: req.user.id,
      farmerName,
      dateOfBuy,
      paymentMethod,
      chequeNumber: paymentMethod === 'cheque' ? chequeNumber : undefined,
      items,
      totalAmount
    });

    await buyProduct.save();
    res.status(201).json({ message: 'Buy product record added', buyProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all buy product records for logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const records = await BuyProduct.find({ user: req.user.id }).sort({ dateOfBuy: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a buy product record by ID
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { farmerName, dateOfBuy, paymentMethod, chequeNumber, items, totalAmount } = req.body;

  try {
    let record = await BuyProduct.findOne({ _id: req.params.id, user: req.user.id });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    if (paymentMethod === 'cheque' && !chequeNumber) {
      return res.status(400).json({ message: 'Cheque number required when payment method is cheque' });
    }

    record.farmerName = farmerName;
    record.dateOfBuy = dateOfBuy;
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

// Delete a buy product record by ID
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const result = await BuyProduct.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
