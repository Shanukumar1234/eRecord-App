const express = require('express');
const router = express.Router();
const HouseholdExpense = require('../models/HouseholdExpense');
const authMiddleware = require('../middleware/authMiddleware');

// Add an expense - Protected route
router.post('/add', authMiddleware, async (req, res) => {
  const { category, amount, description, date } = req.body;

  try {
    const expense = new HouseholdExpense({
      user: req.user.id, // or req.user._id based on your auth middleware
      category,
      amount,
      description,
      date: date ? new Date(date) : Date.now()
    });

    await expense.save();
    return res.status(201).json({ message: 'Expense added', expense });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all expenses for logged-in user - Protected route
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const expenses = await HouseholdExpense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an expense by ID - Protected route
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { category, amount, description, date } = req.body;

  try {
    let expense = await HouseholdExpense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    expense.category = category;
    expense.amount = amount;
    expense.description = description;
    expense.date = date ? new Date(date) : expense.date;

    await expense.save();
    return res.json({ message: 'Expense updated', expense });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete an expense by ID - Protected route
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const result = await HouseholdExpense.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Expense not found' });
    return res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
