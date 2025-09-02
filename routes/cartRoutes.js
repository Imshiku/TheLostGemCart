// const express = require('express');
// const router = express.Router();
// const { requireAuth } = require('../auth/authentication');
// const User = require('../model/user');
// const Product = require('../model/product');

// // Get user cart
// router.get('/cart', requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).populate('cart.productId');
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const items = user.cart.map(item => {
//       const product = item.productId;
//       return {
//         productId: product._id,
//         qty: item.quantity, // Frontend expects 'qty' field
//         quantity: item.quantity, // Keep both for compatibility
//         product: {
//           _id: product._id,
//           id: product._id,
//           name: product.name,
//           price: product.price,
//           image: product.image,
//           description: product.description
//         },
//         itemTotal: product.price * item.quantity
//       };
//     });

//     const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
//     const tax = +(subtotal * 0.1).toFixed(2);
//     const shipping = subtotal > 50 ? 0 : 5;
//     const total = +(subtotal + tax + shipping).toFixed(2);
//     const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

//     res.json({ 
//       items, 
//       subtotal, 
//       tax, 
//       shipping, 
//       total,
//       itemCount 
//     });
//   } catch (err) {
//     console.error('Error getting cart:', err);
//     res.status(500).json({ error: 'Failed to get cart' });
//   }
// });

// // Add to cart
// router.post('/cart', requireAuth, async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     if (!productId) return res.status(400).json({ error: 'Product ID is required' });
//     const qty = Math.max(1, parseInt(quantity) || 1);

//     // Check if product exists in database
//     let product = await Product.findById(productId);
    
//     // If not in database, create it (for products from your static data)
//     if (!product) {
//       // Import your static products to find the product data
//       const { findProduct } = require('../products');
//       const staticProduct = findProduct(productId);
      
//       if (!staticProduct) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
      
//       // Create product in database
//       product = new Product({
//         _id: staticProduct.id,
//         name: staticProduct.name,
//         description: staticProduct.description,
//         price: staticProduct.price,
//         image: staticProduct.image
//       });
//       await product.save();
//     }

//     const user = await User.findById(req.userId);
//     const existing = user.cart.find(item => item.productId.toString() === productId);
    
//     if (existing) {
//       existing.quantity += qty;
//     } else {
//       user.cart.push({ productId, quantity: qty });
//     }

//     await user.save();
//     res.json({ message: `${product.name} added to cart` });
//   } catch (err) {
//     console.error('Error adding to cart:', err);
//     res.status(500).json({ error: 'Failed to add to cart' });
//   }
// });

// // Update cart item quantity
// router.put('/cart/:productId', requireAuth, async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const qty = Math.max(0, parseInt(req.body?.quantity) || 0);

//     const user = await User.findById(req.userId);
//     const cartItem = user.cart.find(item => item.productId.toString() === productId);

//     if (!cartItem) {
//       return res.status(404).json({ error: 'Item not found in cart' });
//     }

//     if (qty === 0) {
//       // Remove item from cart
//       user.cart = user.cart.filter(item => item.productId.toString() !== productId);
//     } else {
//       cartItem.quantity = qty;
//     }

//     await user.save();
//     res.json({ message: 'Cart updated' });
//   } catch (err) {
//     console.error('Error updating cart:', err);
//     res.status(500).json({ error: 'Failed to update cart' });
//   }
// });

// // Remove item from cart
// router.delete('/cart/:productId', requireAuth, async (req, res) => {
//   try {
//     const { productId } = req.params;
    
//     const user = await User.findById(req.userId);
//     user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    
//     await user.save();
//     res.json({ message: 'Item removed from cart' });
//   } catch (err) {
//     console.error('Error removing from cart:', err);
//     res.status(500).json({ error: 'Failed to remove item from cart' });
//   }
// });

// // Clear entire cart (POST method)
// router.post('/cart/clear', requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     user.cart = [];
//     await user.save();
//     res.json({ message: 'Cart cleared successfully' });
//   } catch (err) {
//     console.error('Error clearing cart:', err);
//     res.status(500).json({ error: 'Failed to clear cart' });
//   }
// });

// // Clear entire cart (DELETE method)
// router.delete('/cart', requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     user.cart = [];
//     await user.save();
//     res.json({ message: 'Cart cleared successfully' });
//   } catch (err) {
//     console.error('Error clearing cart:', err);
//     res.status(500).json({ error: 'Failed to clear cart' });
//   }
// });

// // Checkout
// router.post('/checkout', requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).populate('cart.productId');
//     if (!user.cart.length) return res.status(400).json({ error: 'Cart is empty' });

//     const items = user.cart.map(item => {
//       const product = item.productId;
//       const itemTotal = product.price * item.quantity;
//       return {
//         productId: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         price: product.price,
//         itemTotal
//       };
//     });

//     const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
//     const tax = +(subtotal * 0.1).toFixed(2);
//     const shipping = subtotal > 50 ? 0 : 5;
//     const total = +(subtotal + tax + shipping).toFixed(2);
//     const orderId = 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

//     // Clear cart after successful order
//     user.cart = [];
//     await user.save();

//     res.json({ 
//       success: true, 
//       orderId, 
//       message: 'Order placed successfully! (Demo mode)',
//       orderTotal: total,
//       items 
//     });
//   } catch (err) {
//     console.error('Error during checkout:', err);
//     res.status(500).json({ error: 'Checkout failed' });
//   }
// });

// module.exports = router;


// new code 

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

    const items = user.cart.map(item => {
      const product = item.productId;
      return {
        productId: product._id,
        qty: item.quantity, // Frontend expects 'qty' field
        quantity: item.quantity, // Keep both for compatibility
        product: {
          _id: product._id,
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description
        },
        itemTotal: product.price * item.quantity
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
    const tax = +(subtotal * 0.1).toFixed(2);
    const shipping = subtotal > 50 ? 0 : 5;
    const total = +(subtotal + tax + shipping).toFixed(2);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ 
      items, 
      subtotal, 
      tax, 
      shipping, 
      total,
      itemCount 
    });
  } catch (err) {
    console.error('Error getting cart:', err);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// Add to cart
router.post('/cart', requireAuth, async (req, res) => {
  try {
    console.log('Add to cart request:', req.body);
    console.log('User ID:', req.userId);
    
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ error: 'Product ID is required' });
    const qty = Math.max(1, parseInt(quantity) || 1);

    // Check if product exists in database first
    let product = await Product.findById(productId);
    
    // If not in database, create it from static data
    if (!product) {
      console.log('Product not found in DB, checking static data for:', productId);
      
      // Import your static products
      const { findProduct } = require('../products');
      const staticProduct = findProduct(productId);
      
      if (!staticProduct) {
        console.log('Product not found in static data either:', productId);
        return res.status(404).json({ error: 'Product not found' });
      }
      
      console.log('Creating product in DB from static data:', staticProduct);
      
      // Create product in database
      product = new Product({
        _id: staticProduct.id,
        name: staticProduct.name,
        description: staticProduct.description,
        price: staticProduct.price,
        image: staticProduct.image
      });
      
      try {
        await product.save();
        console.log('Product created in DB successfully');
      } catch (saveErr) {
        console.error('Error saving product to DB:', saveErr);
        // If save fails due to duplicate, try to find it again
        product = await Product.findById(productId);
        if (!product) {
          return res.status(500).json({ error: 'Failed to create/find product' });
        }
      }
    }

    console.log('Found/created product:', product);

    const user = await User.findById(req.userId);
    if (!user) {
      console.log('User not found:', req.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User cart before update:', user.cart);

    const existing = user.cart.find(item => item.productId.toString() === productId);
    
    if (existing) {
      console.log('Updating existing cart item quantity');
      existing.quantity += qty;
    } else {
      console.log('Adding new item to cart');
      user.cart.push({ productId, quantity: qty });
    }

    await user.save();
    console.log('User cart after update:', user.cart);

    res.json({ 
      message: `${product.name} added to cart`,
      success: true,
      cartItemCount: user.cart.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart', details: err.message });
  }
});

// Update cart item quantity
router.put('/cart/:productId', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const qty = Math.max(0, parseInt(req.body?.quantity) || 0);

    const user = await User.findById(req.userId);
    const cartItem = user.cart.find(item => item.productId.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (qty === 0) {
      // Remove item from cart
      user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    } else {
      cartItem.quantity = qty;
    }

    await user.save();
    res.json({ message: 'Cart updated' });
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/cart/:productId', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    
    await user.save();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear entire cart (POST method)
router.post('/cart/clear', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Clear entire cart (DELETE method)
router.delete('/cart', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared successfully' });
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

    const items = user.cart.map(item => {
      const product = item.productId;
      const itemTotal = product.price * item.quantity;
      return {
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        itemTotal
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
    const tax = +(subtotal * 0.1).toFixed(2);
    const shipping = subtotal > 50 ? 0 : 5;
    const total = +(subtotal + tax + shipping).toFixed(2);
    const orderId = 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    // Clear cart after successful order
    user.cart = [];
    await user.save();

    res.json({ 
      success: true, 
      orderId, 
      message: 'Order placed successfully! (Demo mode)',
      orderTotal: total,
      items 
    });
  } catch (err) {
    console.error('Error during checkout:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = router;