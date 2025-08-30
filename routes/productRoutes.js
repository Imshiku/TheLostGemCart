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
