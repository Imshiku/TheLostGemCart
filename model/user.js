
const mongoose = require("mongoose");

// 🛒 Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  productId: { type: String, ref: "Product" }, // 🔥 changed from ObjectId → String
  quantity: { type: Number, default: 1 }
});

// 👤 User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  cart: [cartItemSchema] // Array of cart items
}, { timestamps: true });

// 🔗 Model
const User = mongoose.model("User", userSchema, "ecartUsers");

module.exports = User;
