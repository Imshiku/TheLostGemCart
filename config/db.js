


// Connect to MongoDB with better error handling
const mongoose = require('mongoose');
const MONGO_URI = require('dotenv').config().parsed.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Atlas Connected...");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;