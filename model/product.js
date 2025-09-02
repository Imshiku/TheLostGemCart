

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // 👈 use your "p1", "p2"
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;

