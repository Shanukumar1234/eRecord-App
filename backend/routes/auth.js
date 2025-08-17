const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');




// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  // For now, just respond with a message (no email sending)
  // Later you can implement nodemailer and email tokens here
  if (!email) return res.status(400).json({ message: "Email is required" });
  // You can check if email exists in DB and send email logic here
  return res.json({ message: `If ${email} is registered, password reset instructions have been sent.` });
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    ``
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT
    const payload = { id: user._id, name: user.name };
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const fs = require('fs'); // Add this at the top of the file if not already present

// Inside your login route, after generating the token:
fs.writeFileSync('token.txt', token);
console.log('Token saved to token.txt');

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Inside routes/auth.js or similar

router.get("/profile", authMiddleware, async (req, res) => {
   try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
