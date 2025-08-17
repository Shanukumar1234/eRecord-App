const express = require('express');
const router = express.Router();
const EducationFee = require('../models/EducationFee');
const authMiddleware = require('../middleware/authMiddleware');

// ▶ Add fee record
router.post('/add', authMiddleware, async (req, res) => {
  const { childName, classLevel, month, amount, notes } = req.body;

  try {
    const fee = new EducationFee({
      user: req.user.id,
      childName,
      classLevel,
      month,
      amount,
      notes
    });

    await fee.save();
    res.status(201).json({ message: 'Education fee added', fee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ▶ Get all fee records for logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const fees = await EducationFee.find({ user: req.user.id }).sort({ datePaid: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ▶ Update a fee record
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { childName, classLevel, month, amount, notes } = req.body;

  try {
    let fee = await EducationFee.findOne({ _id: req.params.id, user: req.user.id });
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    fee.childName = childName;
    fee.classLevel = classLevel;
    fee.month = month;
    fee.amount = amount;
    fee.notes = notes;

    await fee.save();
    res.json({ message: 'Fee record updated', fee });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ▶ Delete a fee record
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const result = await EducationFee.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Fee record not found' });
    res.json({ message: 'Fee record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
