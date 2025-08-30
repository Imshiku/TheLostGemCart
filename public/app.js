// DOM Helper Functions
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

// Global State
let currentProducts = [];
let currentFilters = {
  search: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  sortBy: 'name',
  sortOrder: 'asc'
};

// API Configuration
const API_BASE = '/api';

// Utility Functions
const formatPrice = (price) => `$${price.toFixed(2)}`;

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const showToast = (message, type = 'success') => {
  const toastEl = $('#toast');
  const toastBody = $('#toastMessage');
  const toastIcon = toastEl.querySelector('i');
  
  // Set message
  toastBody.textContent = message;
  
  // Set icon based on type
  toastIcon.className = type === 'success' ? 'bi bi-check-circle me-2' : 
                       type === 'error' ? 'bi bi-exclamation-circle me-2' : 
                       'bi bi-info-circle me-2';
  
  // Show toast
  const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
  bsToast.show();
};

// API Functions
const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};

// Product Functions
const buildQueryString = (filters) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all' && value !== '') {
      if (key === 'sortBy' || key === 'sortOrder') {
        // Handle sorting
        if (key === 'sortBy') {
          const [sortField, sortDir] = value.split(':');
          params.set('sortBy', sortField);
          params.set('sortOrder', sortDir || filters.sortOrder);
        }
      } else {
        params.set(key, value);
      }
    }
  });
  
  return params.toString();
};

const fetchProducts = async (showLoading = true) => {
  try {
    if (showLoading) {
      $('#loadingSpinner').classList.remove('d-none');
      $('#productsGrid').innerHTML = '';
      $('#productsStats').classList.add('d-none');
      $('#noProductsMessage').classList.add('d-none');
    }

    const queryString = buildQueryString(currentFilters);
    const data = await api.get(`/products${queryString ? `?${queryString}` : ''}`);
    
    currentProducts = data.products || data;
    
    if (showLoading) {
      $('#loadingSpinner').classList.add('d-none');
    }
    
    if (currentProducts.length === 0) {
      $('#noProductsMessage').classList.remove('d-none');
      $('#productsStats').classList.add('d-none');
    } else {
      renderProducts(currentProducts);
      updateProductsStats(currentProducts.length);
      $('#noProductsMessage').classList.add('d-none');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    if (showLoading) {
      $('#loadingSpinner').classList.add('d-none');
    }
    $('#productsGrid').innerHTML = `

      <div class="col-12">
        <div class="text-center py-5">
          <i class="bi bi-exclamation-triangle display-1 text-danger mb-3"></i>
          <h3>Error loading products</h3>
          <p class="text-muted">Please try again later</p>
          <button class="btn btn-gradient" onclick="fetchProducts()">
            <i class="bi bi-arrow-clockwise me-2"></i>Retry
          </button>
        </div>
      </div>
    `;
    showToast('Error loading products', 'error');
  }
};

const renderProducts = (products) => {
  const grid = $('#productsGrid');
  
  if (!products.length) {
    grid.innerHTML = '';
    return;
  }

  grid.innerHTML = products.map(product => createProductCard(product)).join('');
  
  // Add event listeners to add-to-cart buttons
  $$('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.dataset.productId;
      addToCart(productId);
    });
  });
};

// const createProductCard = (product) => {
//   const discountPercentage = product.discount || 0;
//   const originalPrice = product.originalPrice || product.price;
//   const hasDiscount = discountPercentage > 0;
  
//   return `
//     <div class="col-12 col-sm-6 col-lg-4">
//       <div class="card product-card h-100">
//         <div class="position-relative">
//           ${hasDiscount ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
//           <img src="${product.image}" 
//                class="card-img-top" 
//                alt="${product.name}" 
//                style="height: 250px; object-fit: cover;"
//                onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYxZjFmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='">
//           <div class="product-badge">
//             ${formatPrice(product.price)}
//           </div>
//         </div>
        
//         <div class="card-body d-flex flex-column">
//           <div class="d-flex justify-content-between align-items-start mb-2">
//             <h5 class="card-title mb-0">${product.name}</h5>
//             <span class="badge bg-secondary ms-2">${product.category}</span>
//           </div>
          
//           <p class="text-muted small mb-2">${product.brand}</p>
          
//           <div class="d-flex align-items-center mb-2">
//             <div class="rating-stars me-2">
//               ${generateStarRating(product.rating || 0)}
//             </div>
//             <small class="text-muted">(${product.reviews || 0})</small>
//           </div>
          
//           ${hasDiscount ? `
//             <div class="mb-2">
//               <span class="text-decoration-line-through text-muted me-2">
//                 ${formatPrice(originalPrice)}
//               </span>
//               <span class="text-success fw-bold">Save ${formatPrice(originalPrice - product.price)}</span>
//             </div>
//           ` : ''}
          
//           <p class="card-text flex-grow-1 opacity-75">${product.description}</p>
          
//           <div class="mt-auto">
//             ${product.inStock ? `
//               <div class="d-grid">
//                 <button class="btn btn-gradient add-to-cart-btn" data-product-id="${product.id}">
//                   <i class="bi bi-cart-plus me-2"></i>Add to Cart
//                 </button>
//               </div>
//               <small class="text-muted d-block text-center mt-2">
//                 ${product.stockCount} left in stock
//               </small>
//             ` : `
//               <button class="btn btn-secondary disabled" disabled>
//                 <i class="bi bi-x-circle me-2"></i>Out of Stock
//               </button>
//             `}
//           </div>
//         </div>
//       </div>
//     </div>
//   `;
// };


const createProductCard = (product) => {
  const discountPercentage = product.discount || 0;
  const originalPrice = product.originalPrice || product.price;
  const hasDiscount = discountPercentage > 0;
  
  return `
    <div class="col-12 col-sm-6 col-lg-4">
      <!-- Wrap the clickable card content in an <a> -->
      <div class="card product-card h-100 position-relative">
        <a href="product.html?id=${product.id}" class="text-decoration-none text-dark d-block h-100">
          <div class="position-relative">
            ${hasDiscount ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
            <img src="${product.image}" 
                 class="card-img-top" 
                 alt="${product.name}" 
                 style="height: 250px; object-fit: cover;"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYxZjFmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='">
            <div class="product-badge">
              ${formatPrice(product.price)}
            </div>
          </div>

          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${product.name}</h5>
              <span class="badge bg-secondary ms-2">${product.category}</span>
            </div>
            
            <p class="text-muted small mb-2">${product.brand}</p>
            
            <div class="d-flex align-items-center mb-2">
              <div class="rating-stars me-2">
                ${generateStarRating(product.rating || 0)}
              </div>
              <small class="text-muted">(${product.reviews || 0})</small>
            </div>
            
            ${hasDiscount ? `
              <div class="mb-2">
                <span class="text-decoration-line-through text-muted me-2">
                  ${formatPrice(originalPrice)}
                </span>
                <span class="text-success fw-bold">Save ${formatPrice(originalPrice - product.price)}</span>
              </div>
            ` : ''}
            
            <p class="card-text flex-grow-1 opacity-75">${product.description}</p>
          </div>
        </a>

        <!-- Add-to-cart button outside <a> so clicks won't navigate -->
        <div class="card-footer bg-transparent border-0 mt-auto">
          ${product.inStock ? `
            <div class="d-grid">
              <button class="btn btn-gradient add-to-cart-btn" data-product-id="${product.id}">
                <i class="bi bi-cart-plus me-2"></i>Add to Cart
              </button>
            </div>
            <small class="text-muted d-block text-center mt-2">
              ${product.stockCount} left in stock
            </small>
          ` : `
            <button class="btn btn-secondary disabled w-100" disabled>
              <i class="bi bi-x-circle me-2"></i>Out of Stock
            </button>
          `}
        </div>
      </div>
    </div>
  `;
};


const generateStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return `
    ${'<i class="bi bi-star-fill"></i>'.repeat(fullStars)}
    ${hasHalfStar ? '<i class="bi bi-star-half"></i>' : ''}
    ${'<i class="bi bi-star"></i>'.repeat(emptyStars)}
  `;
};

const updateProductsStats = (count) => {
  $('#productsCount').textContent = `${count} product${count !== 1 ? 's' : ''} found`;
  $('#productsStats').classList.remove('d-none');
};

// Cart Functions
const addToCart = async (productId, quantity = 1) => {
  try {
    const result = await api.post('/cart', { productId, quantity });
    await updateCartDisplay();
    showToast(result.message || 'Product added to cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('Failed to add product to cart', 'error');
  }
};

const updateCartQuantity = async (productId, quantity) => {
  try {
    await api.put(`/cart/${productId}`, { quantity });
    await updateCartDisplay();
    showToast('Cart updated');
  } catch (error) {
    console.error('Error updating cart:', error);
    showToast('Failed to update cart', 'error');
  }
};

const removeFromCart = async (productId) => {
  try {
    await api.delete(`/cart/${productId}`);
    await updateCartDisplay();
    showToast('Item removed from cart');
  } catch (error) {
    console.error('Error removing from cart:', error);
    showToast('Failed to remove item from cart', 'error');
  }
};

const clearCart = async () => {
  if (!confirm('Are you sure you want to clear your cart?')) {
    return;
  }
  
  try {
    await api.delete('/cart');
    await updateCartDisplay();
    showToast('Cart cleared');
  } catch (error) {
    console.error('Error clearing cart:', error);
    showToast('Failed to clear cart', 'error');
  }
};

const updateCartDisplay = async () => {
  try {
    const cartData = await api.get('/cart');
    renderCart(cartData);
  } catch (error) {
    console.error('Error fetching cart:', error);
  }
};

const renderCart = (cartData) => {
  const container = $('#cartContainer');
  const emptyState = $('#emptyCartState');
  const summary = $('#cartSummary');
  const cartCount = $('#cartCount');
  
  // Update cart counter
  cartCount.textContent = cartData.itemCount || 0;
  
  if (!cartData.items || cartData.items.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('d-none');
    summary.classList.add('d-none');
    return;
  }
  
  emptyState.classList.add('d-none');
  summary.classList.remove('d-none');
  
  // Render cart items
  container.innerHTML = cartData.items.map(item => `
    <div class="cart-row py-3 d-flex align-items-center">
      <img src="${item.product.image}" 
           alt="${item.product.name}" 
           class="cart-item-img me-3"
           onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFmMWYxZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4/PC90ZXh0Pjwvc3ZnPg=='">
      
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="mb-0">${item.product.name}</h6>
          <span class="fw-bold">${formatPrice(item.itemTotal)}</span>
        </div>
        
        <div class="d-flex align-items-center">
          <div class="input-group input-group-sm me-2" style="width: 120px;">
            <button class="btn btn-outline-secondary" type="button" 
                    onclick="updateCartQuantity('${item.productId}', ${Math.max(1, item.qty - 1)})">
              <i class="bi bi-dash"></i>
            </button>
            <input type="number" class="form-control text-center" 
                   value="${item.qty}" min="1" 
                   onchange="updateCartQuantity('${item.productId}', this.value)">
            <button class="btn btn-outline-secondary" type="button"
                    onclick="updateCartQuantity('${item.productId}', ${item.qty + 1})">
              <i class="bi bi-plus"></i>
            </button>
          </div>
          
          <button class="btn btn-outline-danger btn-sm" 
                  onclick="removeFromCart('${item.productId}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  // Update summary
  $('#cartSubtotal').textContent = formatPrice(cartData.subtotal || 0);
  $('#cartTax').textContent = formatPrice(cartData.tax || 0);
  $('#cartShipping').textContent = cartData.shipping === 0 ? 'Free' : formatPrice(cartData.shipping || 0);
  $('#cartTotal').textContent = formatPrice(cartData.total || 0);
};

const processCheckout = async () => {
  try {
    const result = await api.post('/checkout');
    showToast(`Order placed successfully! Order ID: ${result.orderId}`);
    await updateCartDisplay();
    
    // Close cart sidebar
    const cartOffcanvas = bootstrap.Offcanvas.getInstance($('#cartCanvas'));
    if (cartOffcanvas) {
      cartOffcanvas.hide();
    }
  } catch (error) {
    console.error('Checkout error:', error);
    showToast('Checkout failed. Please try again.', 'error');
  }
};

// Filter Functions
const applyFilters = () => {
  // Get current filter values
  currentFilters.search = $('#searchInput').value.trim();
  currentFilters.category = $('#categoryFilter').value;
  currentFilters.minPrice = $('#minPrice').value;
  currentFilters.maxPrice = $('#maxPrice').value;
  
  const sortValue = $('#sortFilter').value;
  if (sortValue.includes(':')) {
    const [sortBy, sortOrder] = sortValue.split(':');
    currentFilters.sortBy = sortBy;
    currentFilters.sortOrder = sortOrder;
  }
  
  fetchProducts();
};

const clearFilters = () => {
  currentFilters = {
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc'
  };
  
  // Reset form values
  $('#searchInput').value = '';
  $('#categoryFilter').value = 'all';
  $('#sortFilter').value = 'name:asc';
  $('#minPrice').value = '';
  $('#maxPrice').value = '';
  
  fetchProducts();
};

const filterByCategory = (category) => {
  currentFilters.category = category;
  $('#categoryFilter').value = category;
  fetchProducts();
};

// Category Functions
const loadCategories = async () => {
  try {
    const categories = await api.get('/categories');
    const dropdown = $('#categoriesDropdown');
    const select = $('#categoryFilter');
    
    // Clear existing categories
    dropdown.innerHTML = '<li><a class="dropdown-item" href="#" data-category="all">All Products</a></li>';
    select.innerHTML = '<option value="all">All Categories</option>';
    
    // Add categories
    categories.forEach(category => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      
      dropdown.innerHTML += `
        <li><a class="dropdown-item" href="#" data-category="${category}">${categoryName}</a></li>
      `;
      
      select.innerHTML += `<option value="${category}">${categoryName}</option>`;
    });
    
    // Add event listeners to dropdown items
    $$('#categoriesDropdown a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        filterByCategory(category);
      });
    });
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};

// Scroll Functions
const scrollToProducts = () => {
  $('#productsSection').scrollIntoView({ behavior: 'smooth' });
};

const scrollToFilters = () => {
  $('#filtersSection').scrollIntoView({ behavior: 'smooth' });
};

// Event Listeners
const initEventListeners = () => {
  // Search form
  $('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
  });
  
  // Search input with debounce
  $('#searchInput').addEventListener('input', debounce(() => {
    applyFilters();
  }, 500));
  
  // Filter controls
  $('#categoryFilter').addEventListener('change', applyFilters);
  $('#sortFilter').addEventListener('change', applyFilters);
  $('#minPrice').addEventListener('change', applyFilters);
  $('#maxPrice').addEventListener('change', applyFilters);
  
  // Clear filters button
  $('#clearFiltersBtn').addEventListener('click', clearFilters);
  $('#resetFiltersBtn').addEventListener('click', clearFilters);
  
  // Hero buttons
  $('#startShoppingBtn').addEventListener('click', scrollToProducts);
  $('#browseCategoriesBtn').addEventListener('click', scrollToFilters);
  
  // Cart buttons
  $('#checkoutBtn').addEventListener('click', processCheckout);
  $('#clearCartBtn').addEventListener('click', clearCart);
};

// Initialize Application
const initApp = async () => {
  try {
    // Initialize event listeners
    initEventListeners();
    
    // Load initial data
    await Promise.all([
      fetchProducts(),
      loadCategories(),
      updateCartDisplay()
    ]);
    
    console.log('🚀 eCart application initialized successfully!');
  } catch (error) {
    console.error('Error initializing app:', error);
    showToast('Failed to initialize application', 'error');
  }
};

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}