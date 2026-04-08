const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_jwt_auth';

// ========================
// POST /api/auth/register
// ========================
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!email && !phone) {
    return res.status(200).json({ success: false, message: 'Please provide email or phone' });
  }
  if (!password) {
    return res.status(200).json({ success: false, message: 'Please provide password' });
  }
  if (password.length < 6) {
    return res.status(200).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    if (email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(200).json({ success: false, message: 'User already exists with this email' });
      }
    }

    // Create new user (password is hashed automatically via pre-save hook)
    const user = await User.create({ 
      name, 
      email: email ? email.toLowerCase().trim() : undefined, 
      phone: phone ? phone.trim() : undefined, 
      password 
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ success: false, message: 'User already exists with this email' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(200).json({ success: false, message: messages.join(', ') });
    }
    console.error('Register error:', err);
    res.status(200).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ========================
// POST /api/auth/login
// ========================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(200).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(200).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(200).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ========================
// GET /api/auth/me
// ========================
const authMiddleware = require('../middleware/auth');

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
