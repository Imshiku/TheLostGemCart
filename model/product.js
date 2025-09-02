// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   image: { type: String }, // optional, URL of product image
// }, { timestamps: true });

// // 👇 collection name will be "products"
// const Product = mongoose.model("Product", productSchema, "products");

// module.exports = Product;


// // const mongoose = require("mongoose");

// // const productSchema = new mongoose.Schema(
// //   {
// //     name: String,
// //     description: String,
// //     brand: String,
// //     category: String,
// //     price: Number,
// //     stockCount: Number,
// //     inStock: Boolean,
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Product", productSchema);


// chatgpt code 

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



// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: String,
//   brand: String,
//   category: String,
//   price: { type: Number, required: true },
//   stockCount: { type: Number, default: 0 },
//   inStock: { type: Boolean, default: true },
//   rating: { type: Number, default: 0 },
//   reviews: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },
//   originalPrice: { type: Number },
//   image: String,
//   images: [String],
//   features: [String]
// }, { timestamps: true });

// const Product = mongoose.model("Product", productSchema, "products");

// module.exports = Product;
