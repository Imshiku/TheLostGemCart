
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/product");
const { PRODUCTS } = require("./products");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});
    const formatted = PRODUCTS.map(p => ({
      _id: p.id,   // 👈 use "p1", "p2"
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image
    }));

    await Product.insertMany(formatted);

    console.log("✅ Products seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding products:", err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
