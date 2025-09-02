// // // const mongoose = require("mongoose");

// // // const userSchema = new mongoose.Schema({
// // //   name: { type: String, required: true },
// // //   email: { type: String, required: true, unique: true },
// // //   passwordHash: { type: String, required: true },
// // // }, { timestamps: true });

// // // // 👇 explicitly tell Mongoose to use collection "ecartUsers"
// // // const User = mongoose.model("User", userSchema, "ecartUsers");



// // // module.exports = User;


// // // main mongDb code 

// // const mongoose = require("mongoose");

// // const cartItemSchema = new mongoose.Schema({
// //   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
// //   quantity: { type: Number, default: 1 },
// // });

// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   passwordHash: { type: String, required: true },
// //   cart: [cartItemSchema]  // 👈 each user has their own cart
// // }, { timestamps: true });

// // const User = mongoose.model("User", userSchema, "ecartUsers");

// // module.exports = User;


// // // // updated code 

// // // const mongoose = require("mongoose");

// // // const cartItemSchema = new mongoose.Schema({
// // //   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
// // //   quantity: { type: Number, default: 1 },
// // // });

// // // const userSchema = new mongoose.Schema(
// // //   {
// // //     name: { type: String, required: true },
// // //     email: { type: String, required: true, unique: true },
// // //     passwordHash: { type: String, required: true },
// // //     cart: [cartItemSchema], // persistent cart
// // //   },
// // //   { timestamps: true }
// // // );

// // // module.exports = mongoose.model("User", userSchema);


// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   passwordHash: { type: String, required: true },
// // }, { timestamps: true });

// // // 👇 explicitly tell Mongoose to use collection "ecartUsers"
// // const User = mongoose.model("User", userSchema, "ecartUsers");



// // module.exports = User;

// // claude updated code 

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   cart: [{
//     productId: { type: String, required: true }, // Store as string ID, not ObjectId
//     quantity: { type: Number, default: 1 }
//   }]
// }, { timestamps: true });

// const User = mongoose.model("User", userSchema, "ecartUsers");

// module.exports = User;

// chatgpt code 

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   cart: [{
//     productId: { type: String, required: true }, // 👈 matches "p1", "p2"
//     quantity: { type: Number, default: 1 }
//   }]
// }, { timestamps: true });

// const User = mongoose.model("User", userSchema, "ecartUsers");
// module.exports = User;

// orignal code 

// const mongoose = require("mongoose");

// const cartItemSchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//   quantity: { type: Number, default: 1 }
// });

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   cart: [cartItemSchema]
// }, { timestamps: true });

// const User = mongoose.model("User", userSchema, "ecartUsers");

// module.exports = User;


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
