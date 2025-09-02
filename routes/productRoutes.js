const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const { PRODUCTS } = require('../products'); // Your static products data

// Helper function to merge static product data with database data
const mergeProductData = (dbProduct) => {
  const staticProduct = PRODUCTS.find(p => p.id === dbProduct._id);
  if (staticProduct) {
    return {
      ...staticProduct,
      id: dbProduct._id, // Ensure id field exists
      _id: dbProduct._id, // Keep MongoDB _id
      name: dbProduct.name,
      price: dbProduct.price,
      image: dbProduct.image,
      description: dbProduct.description
    };
  }
  return {
    id: dbProduct._id,
    _id: dbProduct._id,
    name: dbProduct.name,
    price: dbProduct.price,
    image: dbProduct.image || '',
    description: dbProduct.description || '',
    category: 'general',
    brand: 'Unknown',
    rating: 0,
    reviews: 0,
    inStock: true,
    stockCount: 10
  };
};

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all products (with filters & sorting)
router.get('/products', async (req, res) => {
  try {
    // For now, use static products data for filtering/sorting
    // You can modify this to use database products if needed
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
router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // First try to find in static products
    const staticProduct = PRODUCTS.find(p => p.id === productId);
    if (staticProduct) {
      return res.json(staticProduct);
    }

    // If not found in static, try database
    const dbProduct = await Product.findById(productId);
    if (dbProduct) {
      const mergedProduct = mergeProductData(dbProduct);
      return res.json(mergedProduct);
    }

    res.status(404).json({ error: 'Product not found' });
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

// Helper function to find product (used by cart routes)
const findProduct = (productId) => {
  return PRODUCTS.find(p => p.id === productId);
};

module.exports = router;
module.exports.findProduct = findProduct;