const express = require('express');
const router = express.Router();
const LabourCost = require('../models/LabourCost');
const authMiddleware = require('../middleware/authMiddleware');

// Add labour cost
router.post('/add', authMiddleware, async (req, res) => {
  const { labourName, itemName, costAmount, date } = req.body;

  try {
    const labourCost = new LabourCost({
      user: req.user.id,
      labourName,
      itemName,
      costAmount,
      date
    });

    await labourCost.save();
    res.status(201).json({ message: 'Labour cost added', labourCost });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all labour costs for logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const labourCosts = await LabourCost.find({ user: req.user.id }).sort({ date: -1 });
    res.json(labourCosts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update labour cost by ID
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { labourName, itemName, costAmount, date } = req.body;

  try {
    let labourCost = await LabourCost.findOne({ _id: req.params.id, user: req.user.id });
    if (!labourCost) return res.status(404).json({ message: 'Labour cost record not found' });

    labourCost.labourName = labourName;
    labourCost.itemName = itemName;
    labourCost.costAmount = costAmount;
    labourCost.date = date;

    await labourCost.save();
    res.json({ message: 'Labour cost updated', labourCost });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete labour cost by ID
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const result = await LabourCost.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Labour cost record not found' });
    res.json({ message: 'Labour cost deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
