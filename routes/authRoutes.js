// // // routes/authRoutes.js
// const express = require('express');
// const router = express.Router();
// const { requireAuth } = require('../auth/authentication'); // 👈 import middleware

// // --- Auth Routes ---

// // Login
// router.post('/login', (req, res) => {
//   // TODO: validate user credentials
//   res.json({ message: 'Login successful (demo)' });
// });

// // Signup
// router.post('/signup', (req, res) => {
//   // TODO: create user account
//   res.json({ message: 'Signup successful (demo)' });
// });

// // Logout
// router.post('/logout', (req, res) => {
//   // TODO: destroy user session
//   res.json({ message: 'Logout successful (demo)' });
// });

// // Example protected route
// router.get('/profile', requireAuth, (req, res) => {
//   res.json({ user: req.user });
// });

// module.exports = router;


// routes/authRoutes.js
// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/controllers"); // ✅ point to your controllers.js

// // all auth routes are already defined in controllers.js
// router.use("/", authController);

// module.exports = router;


// // updated secondeone code 

// const express = require("express");
// const bcrypt = require("bcrypt");
// const User = require("../model/user");
// const router = express.Router();

// // Signup
// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: "User already exists" });

//     const passwordHash = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, passwordHash });

//     req.session.userId = user._id; // save login session
//     res.json({ message: "Signup successful", user });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Login
// // router.post("/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await User.findOne({ email }).populate("cart.product");
// //     if (!user) return res.status(400).json({ error: "Invalid credentials" });

// //     const isMatch = await bcrypt.compare(password, user.passwordHash);
// //     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

// //     req.session.userId = user._id;
// //     res.json({ message: "Login successful", user });
// //   } catch (err) {
// //     console.error("Login error:", err);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// // login 

// // Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email }); // remove .populate("cart.product")
//   if (!user) return res.status(400).json({ error: "Invalid credentials" });

//   const isMatch = await bcrypt.compare(password, user.passwordHash);
//   if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//   req.session.userId = user._id;

//   res.json({ message: "Login successful", user });
// });



// // Logout
// router.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) return res.status(500).json({ error: "Logout failed" });
//     res.json({ message: "Logout successful" });
//   });
// });

// // Get profile (protected)
// router.get("/profile", async (req, res) => {
//   if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });
//   const user = await User.findById(req.session.userId).populate("cart.product");
//   res.json(user);
// });

// module.exports = router;



// // // routes/authRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const { requireAuth } = require('../auth/authentication'); // 👈 import middleware

// // // --- Auth Routes ---

// // // Login
// // router.post('/login', (req, res) => {
// //   // TODO: validate user credentials
// //   res.json({ message: 'Login successful (demo)' });
// // });

// // // Signup
// // router.post('/signup', (req, res) => {
// //   // TODO: create user account
// //   res.json({ message: 'Signup successful (demo)' });
// // });

// // // Logout
// // router.post('/logout', (req, res) => {
// //   // TODO: destroy user session
// //   res.json({ message: 'Logout successful (demo)' });
// // });

// // // Example protected route
// // router.get('/profile', requireAuth, (req, res) => {
// //   res.json({ user: req.user });
// // });

// // module.exports = router;


// claude updated code below 
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const COOKIE_NAME = process.env.COOKIE_NAME || 'ecart_token';

// Register
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ 
      message: 'Registered successfully', 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
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

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ 
      message: 'Login successful', 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  req.session.destroy((err) => {
    if (err) console.error('Session destroy error:', err);
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
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


// final code 

// require('dotenv').config();
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../model/user');

// const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
// const COOKIE_NAME = process.env.COOKIE_NAME || 'ecart_token';

// // Register
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'Name, email, password required' });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(409).json({ message: 'Email already registered' });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, passwordHash, cart: [] });
//     await user.save();

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

//     res.cookie(COOKIE_NAME, token, {
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000
//     });

//     res.json({ 
//       message: 'Registered successfully', 
//       user: { id: user._id, name: user.name, email: user.email } 
//     });
//   } catch (err) {
//     console.error('Register error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password required' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const match = await bcrypt.compare(password, user.passwordHash);
//     if (!match) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

//     res.cookie(COOKIE_NAME, token, {
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000
//     });

//     res.json({ 
//       message: 'Login successful', 
//       user: { id: user._id, name: user.name, email: user.email } 
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Logout
// router.post('/logout', (req, res) => {
//   res.clearCookie(COOKIE_NAME);
//   req.session.destroy((err) => {
//     if (err) console.error('Session destroy error:', err);
//     res.json({ message: 'Logout successful' });
//   });
// });

// // Get current user
// router.get('/me', async (req, res) => {
//   try {
//     const token = req.cookies ? req.cookies[COOKIE_NAME] : null;
//     if (!token) return res.status(401).json({ message: 'Not authenticated' });

//     const payload = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(payload.userId).select('-passwordHash');
//     if (!user) return res.status(401).json({ message: 'User not found' });

//     res.json({ user });
//   } catch (err) {
//     res.status(401).json({ message: 'Not authenticated' });
//   }
// });

// module.exports = router;