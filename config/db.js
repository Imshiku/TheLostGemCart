// // Connect to MongoDB with better error handling
// const mongoose = require('mongoose');
// const MONGO_URI = require('dotenv').config().parsed.MONGO_URI;
// // mongoose.connect(MONGO_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// //   serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
// //   socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
// // })
// //   .then(() => console.log('✅ Connected to MongoDB Atlas'))
// //   .catch(err => {
// //     console.error('❌ MongoDB connection error:', err.message);
// //     console.log('💡 Make sure your IP is whitelisted in MongoDB Atlas Network Access');
// //     console.log('💡 Check: https://cloud.mongodb.com/v2#/security/network/whitelist');
// //   });

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB Atlas Connected...");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


// Connect to MongoDB with better error handling
const mongoose = require('mongoose');
const MONGO_URI = require('dotenv').config().parsed.MONGO_URI;
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//   socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
// })
//   .then(() => console.log('✅ Connected to MongoDB Atlas'))
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err.message);
//     console.log('💡 Make sure your IP is whitelisted in MongoDB Atlas Network Access');
//     console.log('💡 Check: https://cloud.mongodb.com/v2#/security/network/whitelist');
//   });

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