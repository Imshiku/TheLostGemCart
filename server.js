
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL || `http://localhost:${PORT}`
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/img', express.static('img'));

// Session middleware (keep for fallback compatibility)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
       maxAge: 1000 * 60 * 60 * 24, // 24 hours
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    },
  })
);

// Connect MongoDB
connectDB();

// --- Routes ---
app.use('/api/auth', authRoutes);  // Authentication routes
app.use("/api", cartRoutes);       // Cart routes
app.use('/api', productRoutes);    // Product routes

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 eCart server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`🛒 API available at: http://localhost:${PORT}/api`);
});

module.exports = app;