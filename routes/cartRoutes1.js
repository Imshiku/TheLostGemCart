


// // claude updated code below 

// const express = require("express");
// const router = express.Router();
// const User = require("../model/user");
// const { findProduct } = require("../products");
// const { requireAuth } = require("../auth/authentication");

// // Get cart
// router.get("/cart", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Get cart items with product details
//     const cartWithDetails = user.cart.map(item => {
//       const product = findProduct(item.productId);
//       return {
//         productId: item.productId,
//         quantity: item.quantity,
//         product: product,
//         itemTotal: product ? product.price * item.quantity : 0
//       };
//     }).filter(item => item.product); // Remove items where product not found

//     const subtotal = cartWithDetails.reduce((sum, item) => sum + item.itemTotal, 0);
//     const tax = +(subtotal * 0.1).toFixed(2);
//     const shipping = subtotal > 50 ? 0 : 5;
//     const total = +(subtotal + tax + shipping).toFixed(2);

//     res.json({
//       items: cartWithDetails,
//       itemCount: cartWithDetails.length,
//       subtotal,
//       tax,
//       shipping,
//       total
//     });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Add to cart
// router.post("/cart", requireAuth, async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
    
//     if (!productId) return res.status(400).json({ error: 'Product ID is required' });

//     const qty = Math.max(1, parseInt(quantity) || 1);
//     const product = findProduct(productId);

//     if (!product) return res.status(404).json({ error: 'Product not found' });
//     if (!product.inStock) return res.status(400).json({ error: 'Product is out of stock' });

//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const existingItem = user.cart.find(item => item.productId.toString() === productId);
    
//     if (existingItem) {
//       const newQty = existingItem.quantity + qty;
//       if (newQty > product.stockCount) {
//         return res.status(400).json({ error: `Only ${product.stockCount} items available in stock` });
//       }
//       existingItem.quantity = newQty;
//     } else {
//       if (qty > product.stockCount) {
//         return res.status(400).json({ error: `Only ${product.stockCount} items available in stock` });
//       }
//       user.cart.push({ productId, quantity: qty });
//     }

//     await user.save();

//     res.json({ 
//       message: `${product.name} added to cart`,
//       cart: user.cart 
//     });
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Update cart quantity
// router.put("/cart/:productId", requireAuth, async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const qty = Math.max(0, parseInt(req.body.quantity) || 0);

//     const product = findProduct(productId);
//     if (!product) return res.status(404).json({ error: 'Product not found' });

//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const item = user.cart.find(i => i.productId.toString() === productId);
//     if (!item) return res.status(404).json({ error: "Item not found in cart" });

//     if (qty === 0) {
//       user.cart = user.cart.filter(i => i.productId.toString() !== productId);
//     } else {
//       if (qty > product.stockCount) {
//         return res.status(400).json({ error: `Only ${product.stockCount} items available in stock` });
//       }
//       item.quantity = qty;
//     }

//     await user.save();
//     res.json({ message: "Cart updated", cart: user.cart });
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Remove from cart
// router.delete("/cart/:productId", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.cart = user.cart.filter(item => item.productId.toString() !== req.params.productId);
//     await user.save();

//     res.json({ message: "Item removed from cart", cart: user.cart });
//   } catch (error) {
//     console.error("Error removing from cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Clear cart
// router.delete("/cart", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.cart = [];
//     await user.save();

//     res.json({ message: "Cart cleared successfully" });
//   } catch (error) {
//     console.error("Error clearing cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Checkout
// router.post("/checkout", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     if (!user.cart.length) {
//       return res.status(400).json({ error: 'Cart is empty' });
//     }

//     // Calculate total
//     let total = 0;
//     const orderItems = [];
    
//     for (const item of user.cart) {
//       const product = findProduct(item.productId);
//       if (product) {
//         const itemTotal = product.price * item.quantity;
//         total += itemTotal;
//         orderItems.push({
//           productId: item.productId,
//           quantity: item.quantity,
//           price: product.price,
//           itemTotal
//         });
//       }
//     }

//     const tax = +(total * 0.1).toFixed(2);
//     const shipping = total > 50 ? 0 : 5;
//     const finalTotal = +(total + tax + shipping).toFixed(2);

//     const orderId = 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
//     // Clear cart after successful order
//     user.cart = [];
//     await user.save();

//     res.json({
//       success: true,
//       orderId,
//       message: 'Order placed successfully!',
//       orderTotal: finalTotal,
//       items: orderItems
//     });
//   } catch (error) {
//     console.error("Error processing checkout:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;

// chatgpt code 


// const express = require("express");
// const router = express.Router();
// const User = require("../model/user");
// const Product = require("../model/product");
// const { requireAuth } = require("../auth/authentication");


// // Get cart
// router.get("/cart", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Fetch product details for each cart item
//     const cartWithDetails = await Promise.all(
//       user.cart.map(async (item) => {
//         const product = await Product.findOne({ _id: item.productId });
//         if (!product) return null;
//         return {
//           productId: product._id,
//           quantity: item.quantity,
//           product,
//           itemTotal: product.price * item.quantity
//         };
//       })
//     );

//     const filteredCart = cartWithDetails.filter(Boolean);

//     const subtotal = filteredCart.reduce((sum, i) => sum + i.itemTotal, 0);
//     const tax = +(subtotal * 0.1).toFixed(2);
//     const shipping = subtotal > 50 ? 0 : 5;
//     const total = +(subtotal + tax + shipping).toFixed(2);

//     res.json({ items: filteredCart, subtotal, tax, shipping, total });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// // Add to cart
// router.post("/cart", requireAuth, async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const qty = Math.max(1, parseInt(quantity) || 1);

//     const product = await Product.findOne({ _id: productId });
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const existingItem = user.cart.find(i => i.productId === productId);
//     if (existingItem) {
//       existingItem.quantity += qty;
//     } else {
//       user.cart.push({ productId, quantity: qty });
//     }

//     await user.save();
//     res.json({ message: `${product.name} added to cart`, cart: user.cart });
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// // Update cart
// router.put("/cart/:productId", requireAuth, async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const qty = Math.max(0, parseInt(req.body.quantity) || 0);

//     const product = await Product.findOne({ _id: productId });
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const item = user.cart.find(i => i.productId === productId);
//     if (!item) return res.status(404).json({ error: "Item not in cart" });

//     if (qty === 0) {
//       user.cart = user.cart.filter(i => i.productId !== productId);
//     } else {
//       item.quantity = qty;
//     }

//     await user.save();
//     res.json({ message: "Cart updated", cart: user.cart });
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// // Remove from cart
// router.delete("/cart/:productId", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.cart = user.cart.filter(i => i.productId !== req.params.productId);
//     await user.save();

//     res.json({ message: "Item removed", cart: user.cart });
//   } catch (error) {
//     console.error("Error removing from cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// // Clear cart
// router.delete("/cart", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.cart = [];
//     await user.save();

//     res.json({ message: "Cart cleared" });
//   } catch (error) {
//     console.error("Error clearing cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// // Checkout
// router.post("/checkout", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });
//     if (!user.cart.length) return res.status(400).json({ error: "Cart is empty" });

//     let total = 0;
//     const orderItems = [];

//     for (const item of user.cart) {
//       const product = await Product.findOne({ _id: item.productId });
//       if (!product) continue;

//       const itemTotal = product.price * item.quantity;
//       total += itemTotal;

//       orderItems.push({
//         productId: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         price: product.price,
//         itemTotal
//       });
//     }

//     const tax = +(total * 0.1).toFixed(2);
//     const shipping = total > 50 ? 0 : 5;
//     const finalTotal = +(total + tax + shipping).toFixed(2);

//     const orderId = "ORDER-" + Date.now();

//     // clear cart after checkout
//     user.cart = [];
//     await user.save();

//     res.json({ success: true, orderId, items: orderItems, total: finalTotal });
//   } catch (error) {
//     console.error("Error at checkout:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// module.exports = router;


// new updated code date 1/9/25

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../auth/authentication');
const User = require('../model/user');
const Product = require('../model/product');

// Get user cart
router.get('/cart', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.productId');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const items = user.cart.map(i => {
      const product = i.productId;
      return {
        productId: product._id,
        quantity: i.quantity,
        product,
        itemTotal: product.price * i.quantity
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.itemTotal, 0);
    const tax = +(subtotal * 0.1).toFixed(2);
    const shipping = subtotal > 50 ? 0 : 5;
    const total = +(subtotal + tax + shipping).toFixed(2);

    res.json({ items, subtotal, tax, shipping, total });
  } catch (err) {
    console.error('Error getting cart:', err);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// Add to cart
router.post('/cart', requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ error: 'ProductId required' });
    const qty = Math.max(1, parseInt(quantity) || 1);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (!product.inStock) return res.status(400).json({ error: 'Product out of stock' });

    const user = await User.findById(req.userId);
    const existing = user.cart.find(i => i.productId.toString() === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      user.cart.push({ productId, quantity: qty });
    }

    await user.save();
    res.json({ message: `${product.name} added to cart`, cart: user.cart });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Clear cart
router.post('/cart/clear', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Checkout
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.productId');
    if (!user.cart.length) return res.status(400).json({ error: 'Cart is empty' });

    let total = 0;
    const items = user.cart.map(i => {
      const product = i.productId;
      const itemTotal = product.price * i.quantity;
      total += itemTotal;
      return {
        productId: product._id,
        name: product.name,
        quantity: i.quantity,
        price: product.price,
        itemTotal
      };
    });

    const tax = +(total * 0.1).toFixed(2);
    const shipping = total > 50 ? 0 : 5;
    const finalTotal = +(total + tax + shipping).toFixed(2);
    const orderId = 'ORDER-' + Date.now();

    // Clear cart
    user.cart = [];
    await user.save();

    res.json({ success: true, orderId, items, total: finalTotal });
  } catch (err) {
    console.error('Error during checkout:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const User = require("../model/user");
// const Product = require("../model/product");
// const { requireAuth } = require("../auth/authentication");

// // Get cart
// router.get("/cart", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).populate("cart.productId");
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const cartWithDetails = user.cart.map(item => {
//       const product = item.productId;
//       return {
//         productId: product._id,
//         quantity: item.quantity,
//         product,
//         itemTotal: product.price * item.quantity
//       };
//     });

//     const subtotal = cartWithDetails.reduce((sum, i) => sum + i.itemTotal, 0);
//     const tax = +(subtotal * 0.1).toFixed(2);
//     const shipping = subtotal > 50 ? 0 : 5;
//     const total = +(subtotal + tax + shipping).toFixed(2);

//     res.json({ items: cartWithDetails, subtotal, tax, shipping, total });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Add to cart
// router.post("/cart", requireAuth, async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const qty = Math.max(1, parseInt(quantity) || 1);

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     if (!product.inStock) return res.status(400).json({ error: "Out of stock" });

//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const existingItem = user.cart.find(i => i.productId.toString() === productId);
//     if (existingItem) {
//       existingItem.quantity += qty;
//     } else {
//       user.cart.push({ productId, quantity: qty });
//     }

//     await user.save();
//     res.json({ message: `${product.name} added to cart`, cart: user.cart });
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Update cart
// router.put("/cart/:productId", requireAuth, async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const qty = Math.max(0, parseInt(req.body.quantity) || 0);

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const item = user.cart.find(i => i.productId.toString() === productId);
//     if (!item) return res.status(404).json({ error: "Item not in cart" });

//     if (qty === 0) {
//       user.cart = user.cart.filter(i => i.productId.toString() !== productId);
//     } else {
//       item.quantity = qty;
//     }

//     await user.save();
//     res.json({ message: "Cart updated", cart: user.cart });
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Remove from cart
// router.delete("/cart/:productId", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.cart = user.cart.filter(i => i.productId.toString() !== req.params.productId);
//     await user.save();

//     res.json({ message: "Item removed", cart: user.cart });
//   } catch (error) {
//     console.error("Error removing from cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Clear cart
// router.delete("/cart", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.cart = [];
//     await user.save();

//     res.json({ message: "Cart cleared" });
//   } catch (error) {
//     console.error("Error clearing cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Checkout
// router.post("/checkout", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).populate("cart.productId");
//     if (!user) return res.status(404).json({ error: "User not found" });
//     if (!user.cart.length) return res.status(400).json({ error: "Cart is empty" });

//     let total = 0;
//     const orderItems = [];

//     user.cart.forEach(item => {
//       const product = item.productId;
//       const itemTotal = product.price * item.quantity;
//       total += itemTotal;
//       orderItems.push({
//         productId: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         price: product.price,
//         itemTotal
//       });
//     });

//     const tax = +(total * 0.1).toFixed(2);
//     const shipping = total > 50 ? 0 : 5;
//     const finalTotal = +(total + tax + shipping).toFixed(2);

//     const orderId = "ORDER-" + Date.now();

//     user.cart = [];
//     await user.save();

//     res.json({ success: true, orderId, items: orderItems, total: finalTotal });
//   } catch (error) {
//     console.error("Error at checkout:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
