// // // routes/productRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const { PRODUCTS, findProduct, initCart, cartItemsWithDetail } = require('../products');

// // // --- Products & Categories ---

// // // Health check
// // router.get('/health', (req, res) => {
// //   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// // });

// // // Get all products (with filters & sorting)
// // router.get('/products', (req, res) => {
// //   try {
// //     let results = [...PRODUCTS];

// //     // Search filter
// //     const search = req.query.search?.toString().trim().toLowerCase();
// //     if (search) {
// //       results = results.filter(p =>
// //         p.name.toLowerCase().includes(search) ||
// //         p.description.toLowerCase().includes(search) ||
// //         p.brand.toLowerCase().includes(search) ||
// //         p.category.toLowerCase().includes(search)
// //       );
// //     }

// //     // Category filter
// //     const category = req.query.category?.toString().toLowerCase();
// //     if (category && category !== 'all') {
// //       results = results.filter(p => p.category === category);
// //     }

// //     // Price range filter
// //     const minPrice = parseFloat(req.query.minPrice) || 0;
// //     const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
// //     results = results.filter(p => p.price >= minPrice && p.price <= maxPrice);

// //     // Sorting
// //     const sortBy = req.query.sortBy || 'name';
// //     const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

// //     results.sort((a, b) => {
// //       let aVal = a[sortBy];
// //       let bVal = b[sortBy];

// //       if (typeof aVal === 'string') {
// //         aVal = aVal.toLowerCase();
// //         bVal = bVal.toLowerCase();
// //       }

// //       if (aVal < bVal) return -1 * sortOrder;
// //       if (aVal > bVal) return 1 * sortOrder;
// //       return 0;
// //     });

// //     res.json({
// //       products: results,
// //       total: results.length,
// //       filters: { search, category, minPrice, maxPrice, sortBy, sortOrder: sortOrder === 1 ? 'asc' : 'desc' }
// //     });
// //   } catch (error) {
// //     console.error('Error fetching products:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Get single product
// // router.get('/products/:id', (req, res) => {
// //   try {
// //     const product = findProduct(req.params.id);
// //     if (!product) return res.status(404).json({ error: 'Product not found' });
// //     res.json(product);
// //   } catch (error) {
// //     console.error('Error fetching product:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Get categories
// // router.get('/categories', (req, res) => {
// //   try {
// //     const categories = [...new Set(PRODUCTS.map(p => p.category))];
// //     res.json(categories);
// //   } catch (error) {
// //     console.error('Error fetching categories:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // --- Cart & Checkout ---

// // router.get('/cart', (req, res) => {
// //   try {
// //     initCart(req);
// //     res.json(cartItemsWithDetail(req.session.cart));
// //   } catch (error) {
// //     console.error('Error fetching cart:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // router.post('/cart', (req, res) => {
// //   try {
// //     initCart(req);
// //     const { productId, quantity } = req.body || {};

// //     if (!productId) return res.status(400).json({ error: 'Product ID is required' });

// //     const qty = Math.max(1, parseInt(quantity) || 1);
// //     const product = findProduct(productId);

// //     if (!product) return res.status(404).json({ error: 'Product not found' });
// //     if (!product.inStock) return res.status(400).json({ error: 'Product is out of stock' });

// //     const currentQty = req.session.cart[productId] || 0;
// //     const newQty = currentQty + qty;

// //     if (newQty > product.stockCount) {
// //       return res.status(400).json({ error: `Only ${product.stockCount} items available in stock` });
// //     }

// //     req.session.cart[productId] = newQty;
// //     res.json({
// //       ...cartItemsWithDetail(req.session.cart),
// //       message: `${product.name} added to cart`
// //     });
// //   } catch (error) {
// //     console.error('Error adding to cart:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // router.put('/cart/:productId', (req, res) => {
// //   try {
// //     initCart(req);
// //     const { productId } = req.params;
// //     const qty = Math.max(0, parseInt(req.body?.quantity) || 0);

// //     const product = findProduct(productId);
// //     if (!product) return res.status(404).json({ error: 'Product not found' });

// //     if (qty === 0) {
// //       delete req.session.cart[productId];
// //     } else {
// //       if (qty > product.stockCount) return res.status(400).json({ error: `Only ${product.stockCount} items available in stock` });
// //       req.session.cart[productId] = qty;
// //     }

// //     res.json(cartItemsWithDetail(req.session.cart));
// //   } catch (error) {
// //     console.error('Error updating cart:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // router.delete('/cart/:productId', (req, res) => {
// //   try {
// //     initCart(req);
// //     delete req.session.cart[req.params.productId];
// //     res.json(cartItemsWithDetail(req.session.cart));
// //   } catch (error) {
// //     console.error('Error removing from cart:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // router.delete('/cart', (req, res) => {
// //   try {
// //     req.session.cart = {};
// //     res.json({ message: 'Cart cleared successfully' });
// //   } catch (error) {
// //     console.error('Error clearing cart:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // router.post('/checkout', (req, res) => {
// //   try {
// //     initCart(req);
// //     const cart = cartItemsWithDetail(req.session.cart);

// //     if (!cart.items.length) return res.status(400).json({ error: 'Cart is empty' });

// //     const orderId = 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
// //     req.session.cart = {}; // clear cart

// //     res.json({
// //       success: true,
// //       orderId,
// //       message: 'Order placed successfully! (Demo mode)',
// //       orderTotal: cart.total
// //     });
// //   } catch (error) {
// //     console.error('Error processing checkout:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // module.exports = router;



// // // new upadted code 

// // // routes/productRoutes.js
// // const express = require("express");
// // const router = express.Router();
// // const { PRODUCTS, findProduct } = require("../products");
// // const User = require("../model/user");

// // // Middleware to require login
// // function requireLogin(req, res, next) {
// //   if (!req.session.userId) {
// //     return res.status(401).json({ error: "You must be logged in" });
// //   }
// //   next();
// // }

// // // --- Cart & Checkout ---

// // // Get user cart
// // router.get("/cart", requireLogin, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.session.userId).populate("cart.productId");
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     res.json({
// //       items: user.cart.map(item => ({
// //         product: item.productId,
// //         quantity: item.quantity
// //       })),
// //     });
// //   } catch (error) {
// //     console.error("Error fetching cart:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// // // Add to cart
// // router.post("/cart", requireLogin, async (req, res) => {
// //   try {
// //     const { productId, quantity } = req.body;
// //     const qty = Math.max(1, parseInt(quantity) || 1);

// //     const product = findProduct(productId);
// //     if (!product) return res.status(404).json({ error: "Product not found" });

// //     const user = await User.findById(req.session.userId);
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     const existingItem = user.cart.find(item => item.productId.toString() === productId);
// //     if (existingItem) {
// //       existingItem.quantity += qty;
// //     } else {
// //       user.cart.push({ productId, quantity: qty });
// //     }

// //     await user.save();

// //     res.json({ message: `${product.name} added to cart`, cart: user.cart });
// //   } catch (error) {
// //     console.error("Error adding to cart:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// // // Update quantity
// // router.put("/cart/:productId", requireLogin, async (req, res) => {
// //   try {
// //     const { productId } = req.params;
// //     const qty = Math.max(0, parseInt(req.body.quantity) || 0);

// //     const user = await User.findById(req.session.userId);
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     const item = user.cart.find(i => i.productId.toString() === productId);
// //     if (!item) return res.status(404).json({ error: "Item not found in cart" });

// //     if (qty === 0) {
// //       user.cart = user.cart.filter(i => i.productId.toString() !== productId);
// //     } else {
// //       item.quantity = qty;
// //     }

// //     await user.save();

// //     res.json({ message: "Cart updated", cart: user.cart });
// //   } catch (error) {
// //     console.error("Error updating cart:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// // // Remove from cart
// // router.delete("/cart/:productId", requireLogin, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.session.userId);
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     user.cart = user.cart.filter(item => item.productId.toString() !== req.params.productId);
// //     await user.save();

// //     res.json({ message: "Item removed", cart: user.cart });
// //   } catch (error) {
// //     console.error("Error removing from cart:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// // // Clear cart
// // router.delete("/cart", requireLogin, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.session.userId);
// //     if (!user) return res.status(404).json({ error: "User not found" });

// //     user.cart = [];
// //     await user.save();

// //     res.json({ message: "Cart cleared" });
// //   } catch (error) {
// //     console.error("Error clearing cart:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });




// // // updated code last one 

// // // // routes/productRoutes.js
// // // const express = require('express');
// // // const router = express.Router();
// // // const { PRODUCTS } = require('../products'); // your PRODUCTS array

// // // // Helper functions
// // // const findProduct = (id) => PRODUCTS.find(p => p.id === id);

// // // const initCart = (req) => {
// // //   if (!req.session.cart) req.session.cart = {};
// // // };

// // // const cartItemsWithDetail = (cart) => {
// // //   const items = [];
// // //   let subtotal = 0;

// // //   for (const productId in cart) {
// // //     const product = findProduct(productId);
// // //     if (!product) continue;
// // //     const qty = cart[productId];
// // //     const itemTotal = product.price * qty;
// // //     subtotal += itemTotal;

// // //     items.push({
// // //       productId,
// // //       qty,
// // //       itemTotal,
// // //       product
// // //     });
// // //   }

// // //   return {
// // //     items,
// // //     itemCount: items.length,
// // //     subtotal,
// // //     tax: +(subtotal * 0.1).toFixed(2), // example 10% tax
// // //     shipping: subtotal > 50 ? 0 : 5,   // example shipping rule
// // //     total: +(subtotal * 1.1 + (subtotal > 50 ? 0 : 5)).toFixed(2)
// // //   };
// // // };

// // // // --- Products ---
// // // router.get('/', (req, res) => {
// // //   let results = [...PRODUCTS];

// // //   const search = req.query.search?.toLowerCase();
// // //   if (search) {
// // //     results = results.filter(p =>
// // //       p.name.toLowerCase().includes(search) ||
// // //       p.description.toLowerCase().includes(search) ||
// // //       p.brand.toLowerCase().includes(search) ||
// // //       p.category.toLowerCase().includes(search)
// // //     );
// // //   }

// // //   const category = req.query.category?.toLowerCase();
// // //   if (category && category !== 'all') {
// // //     results = results.filter(p => p.category.toLowerCase() === category);
// // //   }

// // //   const minPrice = parseFloat(req.query.minPrice) || 0;
// // //   const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
// // //   results = results.filter(p => p.price >= minPrice && p.price <= maxPrice);

// // //   // Sorting
// // //   const sortBy = req.query.sortBy || 'name';
// // //   const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

// // //   results.sort((a, b) => {
// // //     let aVal = a[sortBy];
// // //     let bVal = b[sortBy];
// // //     if (typeof aVal === 'string') {
// // //       aVal = aVal.toLowerCase();
// // //       bVal = bVal.toLowerCase();
// // //     }
// // //     if (aVal < bVal) return -1 * sortOrder;
// // //     if (aVal > bVal) return 1 * sortOrder;
// // //     return 0;
// // //   });

// // //   res.json({
// // //     products: results,
// // //     total: results.length,
// // //     filters: { search, category, minPrice, maxPrice, sortBy, sortOrder: sortOrder === 1 ? 'asc' : 'desc' }
// // //   });
// // // });

// // // // Single product
// // // router.get('/:id', (req, res) => {
// // //   const product = findProduct(req.params.id);
// // //   if (!product) return res.status(404).json({ error: 'Product not found' });
// // //   res.json(product);
// // // });

// // // // Categories
// // // router.get('/categories', (req, res) => {
// // //   const categories = [...new Set(PRODUCTS.map(p => p.category))];
// // //   res.json(categories);
// // // });

// // // // --- Cart ---
// // // router.get('/cart', (req, res) => {
// // //   initCart(req);
// // //   res.json(cartItemsWithDetail(req.session.cart));
// // // });

// // // router.post('/cart', (req, res) => {
// // //   initCart(req);
// // //   const { productId, quantity } = req.body;
// // //   if (!productId) return res.status(400).json({ error: 'Product ID required' });

// // //   const product = findProduct(productId);
// // //   if (!product) return res.status(404).json({ error: 'Product not found' });
// // //   if (!product.inStock) return res.status(400).json({ error: 'Product out of stock' });

// // //   const qty = Math.max(1, parseInt(quantity) || 1);
// // //   const currentQty = req.session.cart[productId] || 0;
// // //   if (currentQty + qty > product.stockCount) {
// // //     return res.status(400).json({ error: `Only ${product.stockCount} items available` });
// // //   }

// // //   req.session.cart[productId] = currentQty + qty;
// // //   res.json({
// // //     ...cartItemsWithDetail(req.session.cart),
// // //     message: `${product.name} added to cart`
// // //   });
// // // });

// // // router.put('/cart/:productId', (req, res) => {
// // //   initCart(req);
// // //   const { productId } = req.params;
// // //   const qty = Math.max(0, parseInt(req.body.quantity) || 0);

// // //   const product = findProduct(productId);
// // //   if (!product) return res.status(404).json({ error: 'Product not found' });

// // //   if (qty === 0) delete req.session.cart[productId];
// // //   else {
// // //     if (qty > product.stockCount) return res.status(400).json({ error: `Only ${product.stockCount} items available` });
// // //     req.session.cart[productId] = qty;
// // //   }

// // //   res.json(cartItemsWithDetail(req.session.cart));
// // // });

// // // router.delete('/cart/:productId', (req, res) => {
// // //   initCart(req);
// // //   delete req.session.cart[req.params.productId];
// // //   res.json(cartItemsWithDetail(req.session.cart));
// // // });

// // // router.delete('/cart', (req, res) => {
// // //   req.session.cart = {};
// // //   res.json({ message: 'Cart cleared' });
// // // });

// // // // Checkout
// // // router.post('/checkout', (req, res) => {
// // //   initCart(req);
// // //   const cart = cartItemsWithDetail(req.session.cart);
// // //   if (!cart.items.length) return res.status(400).json({ error: 'Cart empty' });

// // //   const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// // //   req.session.cart = {}; // clear cart

// // //   res.json({
// // //     success: true,
// // //     orderId,
// // //     message: 'Order placed successfully',
// // //     orderTotal: cart.total
// // //   });
// // // });

// // // module.exports = router;

// // this is the orignal code 


// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { PRODUCTS, findProduct, initCart, cartItemsWithDetail } = require('../products');

// --- Products & Categories ---

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all products (with filters & sorting)
router.get('/products', (req, res) => {
  try {
    let results = [...PRODUCTS];

    // Search filter
    const search = req.query.search?.toString().trim().toLowerCase();
    if (search) {
      results = results.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
    }

    // Category filter
    const category = req.query.category?.toString().toLowerCase();
    if (category && category !== 'all') {
      results = results.filter(p => p.category === category);
    }

    // Price range filter
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    results = results.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Sorting
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    results.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });

    res.json({
      products: results,
      total: results.length,
      filters: { search, category, minPrice, maxPrice, sortBy, sortOrder: sortOrder === 1 ? 'asc' : 'desc' }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/products/:id', (req, res) => {
  try {
    const product = findProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get categories
router.get('/categories', (req, res) => {
  try {
    const categories = [...new Set(PRODUCTS.map(p => p.category))];
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Cart & Checkout ---

router.get('/cart', (req, res) => {
  try {
    initCart(req);
    res.json(cartItemsWithDetail(req.session.cart));
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/cart', (req, res) => {
  try {
    initCart(req);
    const { productId, quantity } = req.body || {};

    if (!productId) return res.status(400).json({ error: 'Product ID is required' });

    const qty = Math.max(1, parseInt(quantity) || 1);
    const product = findProduct(productId);

    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (!product.inStock) return res.status(400).json({ error: 'Product is out of stock' });

    const currentQty = req.session.cart[productId] || 0;
    const newQty = currentQty + qty;

    if (newQty > product.stockCount) {
      return res.status(400).json({ error: `Only ${product.stockCount} items available in stock` });
    }

    req.session.cart[productId] = newQty;
    res.json({
      ...cartItemsWithDetail(req.session.cart),
      message: `${product.name} added to cart`
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/cart/:productId', (req, res) => {
  try {
    initCart(req);
    const { productId } = req.params;
    const qty = Math.max(0, parseInt(req.body?.quantity) || 0);

    const product = findProduct(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (qty === 0) {
      delete req.session.cart[productId];
    } else {
      if (qty > product.stockCount) return res.status(400).json({ error: `Only ${product.stockCount} items available in stock` });
      req.session.cart[productId] = qty;
    }

    res.json(cartItemsWithDetail(req.session.cart));
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/cart/:productId', (req, res) => {
  try {
    initCart(req);
    delete req.session.cart[req.params.productId];
    res.json(cartItemsWithDetail(req.session.cart));
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/cart', (req, res) => {
  try {
    req.session.cart = {};
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/checkout', (req, res) => {
  try {
    initCart(req);
    const cart = cartItemsWithDetail(req.session.cart);

    if (!cart.items.length) return res.status(400).json({ error: 'Cart is empty' });

    const orderId = 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    req.session.cart = {}; // clear cart

    res.json({
      success: true,
      orderId,
      message: 'Order placed successfully! (Demo mode)',
      orderTotal: cart.total
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


// // claude updated code below 

// // const express = require('express');
// // const router = express.Router();
// // const { PRODUCTS, findProduct } = require('../products');

// // // --- Products & Categories ---

// // // Health check
// // router.get('/health', (req, res) => {
// //   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// // });

// // // Get all products (with filters & sorting)
// // router.get('/products', (req, res) => {
// //   try {
// //     let results = [...PRODUCTS];

// //     // Search filter
// //     const search = req.query.search?.toString().trim().toLowerCase();
// //     if (search) {
// //       results = results.filter(p =>
// //         p.name.toLowerCase().includes(search) ||
// //         p.description.toLowerCase().includes(search) ||
// //         p.brand.toLowerCase().includes(search) ||
// //         p.category.toLowerCase().includes(search)
// //       );
// //     }

// //     // Category filter
// //     const category = req.query.category?.toString().toLowerCase();
// //     if (category && category !== 'all') {
// //       results = results.filter(p => p.category === category);
// //     }

// //     // Price range filter
// //     const minPrice = parseFloat(req.query.minPrice) || 0;
// //     const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
// //     results = results.filter(p => p.price >= minPrice && p.price <= maxPrice);

// //     // Sorting
// //     const sortBy = req.query.sortBy || 'name';
// //     const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

// //     results.sort((a, b) => {
// //       let aVal = a[sortBy];
// //       let bVal = b[sortBy];

// //       if (typeof aVal === 'string') {
// //         aVal = aVal.toLowerCase();
// //         bVal = bVal.toLowerCase();
// //       }

// //       if (aVal < bVal) return -1 * sortOrder;
// //       if (aVal > bVal) return 1 * sortOrder;
// //       return 0;
// //     });

// //     res.json({
// //       products: results,
// //       total: results.length,
// //       filters: { search, category, minPrice, maxPrice, sortBy, sortOrder: sortOrder === 1 ? 'asc' : 'desc' }
// //     });
// //   } catch (error) {
// //     console.error('Error fetching products:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Get single product
// // router.get('/products/:id', (req, res) => {
// //   try {
// //     const product = findProduct(req.params.id);
// //     if (!product) return res.status(404).json({ error: 'Product not found' });
// //     res.json(product);
// //   } catch (error) {
// //     console.error('Error fetching product:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Get categories
// // router.get('/categories', (req, res) => {
// //   try {
// //     const categories = [...new Set(PRODUCTS.map(p => p.category))];
// //     res.json(categories);
// //   } catch (error) {
// //     console.error('Error fetching categories:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // module.exports = router;


// chatgpt code 


// const express = require("express");
// const router = express.Router();
// const Product = require("../model/product");

// // Health check
// router.get("/health", (req, res) => {
//   res.json({ status: "ok", timestamp: new Date().toISOString() });
// });

// // Get all products
// router.get("/products", async (req, res) => {
//   try {
//     let query = {};

//     // Search filter
//     if (req.query.search) {
//       query.name = { $regex: req.query.search, $options: "i" };
//     }
//     if (req.query.category) {
//       query.category = req.query.category;
//     }

//     const products = await Product.find(query);
//     res.json({ products, total: products.length });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Get single product
// router.get("/products/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Get categories
// router.get("/categories", async (req, res) => {
//   try {
//     const categories = await Product.distinct("category");
//     res.json(categories);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;


// new updated chatgpt code 

// const express = require('express');
// const router = express.Router();
// const Product = require('../model/product');

// // Get all products
// router.get('/products', async (req, res) => {
//   try {
//     const products = await Product.find().lean();
//     res.json({ products });
//   } catch (err) {
//     console.error('Error fetching products:', err);
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });

// // Optional: get single product
// router.get('/products/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).lean();
//     if (!product) return res.status(404).json({ error: 'Product not found' });
//     res.json(product);
//   } catch (err) {
//     console.error('Error fetching product:', err);
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// });

// module.exports = router;
