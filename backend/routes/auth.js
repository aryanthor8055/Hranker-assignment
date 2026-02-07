const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly, userOnly } = require('../middleware/auth');

const router = express.Router();

const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await User.create({ email, password, role: 'user' });
    const token = genToken(user._id);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = genToken(user._id);
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed' });
  }
});

router.get('/me', protect, (req, res) => {
  res.json({
    _id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  });
});

router.get('/dashboard/user', protect, userOnly, (req, res) => {
  res.json({ message: 'User dashboard', email: req.user.email });
});

router.get('/dashboard/admin', protect, adminOnly, (req, res) => {
  res.json({ message: 'Admin dashboard', email: req.user.email });
});

module.exports = router;
