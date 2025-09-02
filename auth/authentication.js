
// // authentication.js
// require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const User = require('../model/user');

// const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
// const COOKIE_NAME = process.env.COOKIE_NAME || 'ecart_token';

// async function requireAuth(req, res, next) {
//   try {
//     const token = req.cookies ? req.cookies[COOKIE_NAME] : null;
//     if (!token) return res.status(401).json({ message: 'Unauthorized' });

//     const payload = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(payload.userId).select('-passwordHash');
//     if (!user) return res.status(401).json({ message: 'Unauthorized' });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('auth error', err);
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// }

// module.exports = { requireAuth };

// claude updated code below 

require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const COOKIE_NAME = process.env.COOKIE_NAME || 'ecart_token';

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies ? req.cookies[COOKIE_NAME] : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { requireAuth };