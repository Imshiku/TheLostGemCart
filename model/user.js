const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

// 👇 explicitly tell Mongoose to use collection "ecartUsers"
const User = mongoose.model("User", userSchema, "ecartUsers");



module.exports = User;
