
// claude code 

require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../model/user');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const COOKIE_NAME = process.env.COOKIE_NAME || 'ecart_token';

// Helper function to create JWT token
const createJWTToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Helper function to set auth cookie
const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  });
};

// Existing Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, password required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, cart: [] });
    await user.save();

    const token = createJWTToken(user._id);
    setAuthCookie(res, token);

    res.json({ 
      message: 'Registered successfully', 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Existing Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user has password (not Google-only user)
    if (!user.passwordHash) {
      return res.status(401).json({ message: 'Please login with Google' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createJWTToken(user._id);
    setAuthCookie(res, token);

    res.json({ 
      message: 'Login successful', 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// NEW: Google OAuth initiation
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // This forces account selection every time!
  })
);

// NEW: Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // User is available in req.user from passport
      const user = req.user;
      console.log('Google callback - user:', user);
      
      // Create JWT token
      const token = createJWTToken(user._id);
      setAuthCookie(res, token);
      
      // Redirect to dashboard/home page
      res.redirect('/?login=success');
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect('/login?error=google_auth_failed');
    }
  }
);

// Updated Logout route (clears session too)
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  
  // Clear passport session
  req.logout((err) => {
    if (err) console.error('Logout error:', err);
    
    req.session.destroy((err) => {
      if (err) console.error('Session destroy error:', err);
      res.json({ message: 'Logout successful' });
    });
  });
});

// Existing Get current user route
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies ? req.cookies[COOKIE_NAME] : null;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router;