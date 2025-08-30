// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../auth/authentication'); // 👈 import middleware

// --- Auth Routes ---

// Login
router.post('/login', (req, res) => {
  // TODO: validate user credentials
  res.json({ message: 'Login successful (demo)' });
});

// Signup
router.post('/signup', (req, res) => {
  // TODO: create user account
  res.json({ message: 'Signup successful (demo)' });
});

// Logout
router.post('/logout', (req, res) => {
  // TODO: destroy user session
  res.json({ message: 'Logout successful (demo)' });
});

// Example protected route
router.get('/profile', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
