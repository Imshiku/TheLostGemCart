// // ----------------- Utilities -----------------
// const $ = (selector) => document.querySelector(selector);
// const $$ = (selector) => document.querySelectorAll(selector);

// // ----------------- API -----------------
// const API_BASE = '/api';

// const api = {
//   async get(endpoint) {
//     try {
//       const response = await fetch(`${API_BASE}${endpoint}`, { credentials: 'include' });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       return await response.json();
//     } catch (error) {
//       console.error('API GET Error:', error);
//       throw error;
//     }
//   },

//   async post(endpoint, data) {
//     try {
//       const response = await fetch(`${API_BASE}${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//         credentials: 'include'
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       return await response.json();
//     } catch (error) {
//       console.error('API POST Error:', error);
//       throw error;
//     }
//   }
// };

// // ----------------- Toast -----------------
// const showToast = (message, type = 'success', duration = 2500) => {
//   const toastEl = document.createElement('div');
//   toastEl.className = `toast align-items-center text-white bg-${type} border-0 show`;
//   toastEl.role = 'alert';
//   toastEl.innerHTML = `<div class="d-flex">
//     <div class="toast-body">${message}</div>
//     <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
//   </div>`;
//   document.body.appendChild(toastEl);
//   setTimeout(() => toastEl.remove(), duration);
// };

// // ----------------- Cart Functions -----------------
// const updateCartDisplay = async () => {
//   try {
//     const cart = await api.get('/cart');
//     $('#cartCount').textContent = cart.items.length || 0;

//     const cartContainer = $('#cartContainer');
//     if (!cart.items.length) {
//       $('#emptyCartState').classList.remove('d-none');
//       $('#cartSummary').classList.add('d-none');
//       cartContainer.innerHTML = '';
//       return;
//     }

//     $('#emptyCartState').classList.add('d-none');
//     $('#cartSummary').classList.remove('d-none');

//     cartContainer.innerHTML = cart.items.map(item => `
//       <div class="d-flex justify-content-between align-items-center mb-2">
//         <span>${item.product.name} x ${item.quantity}</span>
//         <span>$${item.itemTotal.toFixed(2)}</span>
//       </div>
//     `).join('');

//     $('#cartSubtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
//     $('#cartTax').textContent = `$${cart.tax.toFixed(2)}`;
//     $('#cartShipping').textContent = `$${cart.shipping.toFixed(2)}`;
//     $('#cartTotal').textContent = `$${cart.total.toFixed(2)}`;
//   } catch (error) {
//     console.error('Error updating cart display:', error);
//   }
// };

// const addToCart = async (productId, quantity = 1) => {
//   try {
//     console.log("➡️ Sending to backend:", { productId, quantity });
//     const result = await api.post('/cart', { productId, quantity });
//     await updateCartDisplay();
//     showToast(result.message || 'Product added to cart');
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     showToast('Failed to add product to cart', 'danger');
//   }
// };

// // ----------------- Product Functions -----------------
// const createProductCard = (product) => `
//   <div class="col-md-4 mb-4">
//     <div class="card h-100 shadow-sm">
//       <img src="${product.image || 'placeholder.png'}" class="card-img-top" alt="${product.name}">
//       <div class="card-body d-flex flex-column">
//         <h5 class="card-title">${product.name}</h5>
//         <p class="card-text text-muted">${product.description || ''}</p>
//         <div class="mt-auto">
//           <div class="d-flex align-items-center mb-2">
//             <input type="number" min="1" value="1" class="form-control form-control-sm quantity-input me-2" data-product-id="${product._id}" style="width: 60px;">
//             <span class="fw-bold">$${product.price.toFixed(2)}</span>
//           </div>
//           <button class="btn btn-sm btn-outline-primary add-to-cart-btn w-100" data-product-id="${product._id}">
//             <i class="bi bi-cart-plus"></i> Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// `;

// let currentProducts = [];

// const renderProducts = (products) => {
//   const grid = $('#productsGrid');
//   if (!products || !products.length) {
//     grid.innerHTML = '<p class="text-center">No products found</p>';
//     return;
//   }
//   grid.innerHTML = products.map(createProductCard).join('');

//   // Event listeners for Add-to-Cart buttons
//   $$('.add-to-cart-btn').forEach(btn => {
//     btn.addEventListener('click', (e) => {
//       e.preventDefault();
//       const productId = btn.dataset.productId;
//       const qtyInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
//       const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
//       addToCart(productId, quantity);
//     });
//   });
// };

// // ----------------- Filters -----------------
// let currentFilters = { category: 'all', sortBy: 'name', sortOrder: 'asc', minPrice: null, maxPrice: null };

// const applyFilters = () => {
//   let filtered = currentProducts.slice();
//   if (currentFilters.category && currentFilters.category !== 'all') {
//     filtered = filtered.filter(p => p.category === currentFilters.category);
//   }
//   if (currentFilters.minPrice != null) filtered = filtered.filter(p => p.price >= currentFilters.minPrice);
//   if (currentFilters.maxPrice != null) filtered = filtered.filter(p => p.price <= currentFilters.maxPrice);

//   if (currentFilters.sortBy) {
//     filtered.sort((a, b) => {
//       let valA = a[currentFilters.sortBy];
//       let valB = b[currentFilters.sortBy];
//       if (typeof valA === 'string') valA = valA.toLowerCase();
//       if (typeof valB === 'string') valB = valB.toLowerCase();
//       if (valA < valB) return currentFilters.sortOrder === 'asc' ? -1 : 1;
//       if (valA > valB) return currentFilters.sortOrder === 'asc' ? 1 : -1;
//       return 0;
//     });
//   }

//   renderProducts(filtered);
// };

// const setupFilters = () => {
//   $('#categoryFilter').addEventListener('change', e => {
//     currentFilters.category = e.target.value;
//     applyFilters();
//   });

//   $('#sortFilter').addEventListener('change', e => {
//     const [sortBy, sortOrder] = e.target.value.split(':');
//     currentFilters.sortBy = sortBy;
//     currentFilters.sortOrder = sortOrder;
//     applyFilters();
//   });

//   $('#minPrice').addEventListener('input', e => {
//     currentFilters.minPrice = e.target.value ? parseFloat(e.target.value) : null;
//     applyFilters();
//   });

//   $('#maxPrice').addEventListener('input', e => {
//     currentFilters.maxPrice = e.target.value ? parseFloat(e.target.value) : null;
//     applyFilters();
//   });

//   $('#clearFiltersBtn').addEventListener('click', () => {
//     currentFilters = { category: 'all', sortBy: 'name', sortOrder: 'asc', minPrice: null, maxPrice: null };
//     $('#categoryFilter').value = 'all';
//     $('#sortFilter').value = 'name:asc';
//     $('#minPrice').value = '';
//     $('#maxPrice').value = '';
//     applyFilters();
//   });
// };

// // ----------------- Search -----------------
// $('#searchForm').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const term = $('#searchInput').value.toLowerCase();
//   const filtered = currentProducts.filter(p => p.name.toLowerCase().includes(term));
//   renderProducts(filtered);
// });

// // ----------------- Fetch Products -----------------
// const fetchProducts = async () => {
//   try {
//     $('#loadingSpinner').classList.remove('d-none');
//     const data = await api.get('/products');
//     currentProducts = data.products || [];
//     const categories = [...new Set(currentProducts.map(p => p.category))];
//     const catDropdown = $('#categoriesDropdown');
//     categories.forEach(cat => {
//       const li = document.createElement('li');
//       li.innerHTML = `<a class="dropdown-item" href="#" data-category="${cat}">${cat}</a>`;
//       catDropdown.appendChild(li);
//     });

//     renderProducts(currentProducts);
//     setupFilters();
//     $('#loadingSpinner').classList.add('d-none');
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     $('#productsGrid').innerHTML = '<p class="text-center text-danger">Failed to load products</p>';
//     showToast('Error loading products', 'danger');
//   }
// };

// // ----------------- Checkout & Cart Buttons -----------------
// $('#clearCartBtn').addEventListener('click', async () => {
//   try {
//     await api.post('/cart/clear', {});
//     await updateCartDisplay();
//     showToast('Cart cleared');
//   } catch (error) {
//     console.error(error);
//     showToast('Failed to clear cart', 'danger');
//   }
// });

// $('#checkoutBtn').addEventListener('click', async () => {
//   try {
//     const result = await api.post('/checkout', {});
//     await updateCartDisplay();
//     showToast(`Order ${result.orderId} placed! Total $${result.total.toFixed(2)}`);
//   } catch (error) {
//     console.error(error);
//     showToast('Checkout failed', 'danger');
//   }
// });

// // ----------------- Auth Buttons -----------------
// const updateAuthButtons = async () => {
//   const container = $('#authButtons');
//   try {
//     const user = await api.get('/auth/me');
//     if (user && user.name) {
//       container.innerHTML = `
//         <button class="btn btn-outline-light dropdown-toggle" data-bs-toggle="dropdown">
//           Hi, ${user.name}
//         </button>
//         <ul class="dropdown-menu dropdown-menu-end">
//           <li><a class="dropdown-item" href="/profile">Profile</a></li>
//           <li><a class="dropdown-item" href="/logout" id="logoutBtn">Logout</a></li>
//         </ul>`;
//       $('#logoutBtn').addEventListener('click', async e => {
//         e.preventDefault();
//         await api.post('/auth/logout', {});
//         window.location.reload();
//       });
//     } else {
//       container.innerHTML = `
//         <a href="/login" class="btn btn-primary me-2">Login</a>
//         <a href="/signup" class="btn btn-outline-light">Sign Up</a>`;
//     }
//   } catch {
//     container.innerHTML = `
//       <a href="/login" class="btn btn-primary me-2">Login</a>
//       <a href="/signup" class="btn btn-outline-light">Sign Up</a>`;
//   }
// };

// // ----------------- Init -----------------
// document.addEventListener('DOMContentLoaded', async () => {
//   fetchProducts();
//   updateCartDisplay();
//   updateAuthButtons();
// });


// claude code 

// DOM Helper Functions
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

// Global State
let currentProducts = [];
let currentUser = null;
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
  if (!toastEl) return;
  
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
      const response = await fetch(`${API_BASE}${endpoint}`, {
        credentials: 'include'
      });
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
        credentials: 'include',
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
        credentials: 'include',
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
        method: 'DELETE',
        credentials: 'include'
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

// Authentication Functions (using your existing script.js logic)
const checkAuth = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.user) {
      currentUser = response.user;
      return true;
    }
    currentUser = null;
    return false;
  } catch (error) {
    currentUser = null;
    return false;
  }
};

// Product Functions
const buildQueryString = (filters) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all' && value !== '') {
      if (key === 'sortBy' || key === 'sortOrder') {
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
      const spinner = $('#loadingSpinner');
      const grid = $('#productsGrid');
      const stats = $('#productsStats');
      const noProducts = $('#noProductsMessage');
      
      if (spinner) spinner.classList.remove('d-none');
      if (grid) grid.innerHTML = '';
      if (stats) stats.classList.add('d-none');
      if (noProducts) noProducts.classList.add('d-none');
    }

    const queryString = buildQueryString(currentFilters);
    const data = await api.get(`/products${queryString ? `?${queryString}` : ''}`);
    
    currentProducts = data.products || data;
    
    if (showLoading) {
      const spinner = $('#loadingSpinner');
      if (spinner) spinner.classList.add('d-none');
    }
    
    if (currentProducts.length === 0) {
      const noProducts = $('#noProductsMessage');
      const stats = $('#productsStats');
      if (noProducts) noProducts.classList.remove('d-none');
      if (stats) stats.classList.add('d-none');
    } else {
      renderProducts(currentProducts);
      updateProductsStats(currentProducts.length);
      const noProducts = $('#noProductsMessage');
      if (noProducts) noProducts.classList.add('d-none');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    if (showLoading) {
      const spinner = $('#loadingSpinner');
      if (spinner) spinner.classList.add('d-none');
    }
    const grid = $('#productsGrid');
    if (grid) {
      grid.innerHTML = `
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
    }
    showToast('Error loading products', 'error');
  }
};

const renderProducts = (products) => {
  const grid = $('#productsGrid');
  if (!grid) return;
  
  if (!products.length) {
    grid.innerHTML = '';
    return;
  }

  grid.innerHTML = products.map(product => createProductCard(product)).join('');
  
  // Add event listeners to add-to-cart buttons
  $$('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent navigation when clicking add to cart
      const productId = btn.dataset.productId;
      addToCart(productId);
    });
  });
};

const createProductCard = (product) => {
  const discountPercentage = product.discount || 0;
  const originalPrice = product.originalPrice || product.price;
  const hasDiscount = discountPercentage > 0;
  
  return `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card product-card h-100 position-relative">
        <!-- Clickable area for product details -->
        <a href="product.html?id=${product.id}" class="text-decoration-none text-dark position-absolute w-100 h-100" style="z-index: 1;"></a>
        
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
          
          <div class="mt-auto" style="position: relative; z-index: 2;">
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
  const statsEl = $('#productsCount');
  const statsContainer = $('#productsStats');
  
  if (statsEl) {
    statsEl.textContent = `${count} product${count !== 1 ? 's' : ''} found`;
  }
  if (statsContainer) {
    statsContainer.classList.remove('d-none');
  }
};

// Cart Functions
const addToCart = async (productId, quantity = 1) => {
  try {
    // Check if user is logged in
    if (!currentUser) {
      showToast('Please login to add items to cart', 'error');
      window.location.href = '/login';
      return;
    }

    const result = await api.post('/cart', { productId, quantity });
    await updateCartDisplay();
    showToast(result.message || 'Product added to cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (error.message.includes('401')) {
      showToast('Please login to add items to cart', 'error');
      window.location.href = '/login';
    } else {
      showToast('Failed to add product to cart', 'error');
    }
  }
};

const updateCartQuantity = async (productId, quantity) => {
  try {
    if (!currentUser) {
      showToast('Please login first', 'error');
      return;
    }

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
    if (!currentUser) {
      showToast('Please login first', 'error');
      return;
    }

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
    if (!currentUser) {
      showToast('Please login first', 'error');
      return;
    }

    await api.post('/cart/clear');
    await updateCartDisplay();
    showToast('Cart cleared');
  } catch (error) {
    console.error('Error clearing cart:', error);
    showToast('Failed to clear cart', 'error');
  }
};

const updateCartDisplay = async () => {
  try {
    if (!currentUser) {
      // Show empty cart for non-logged in users
      renderCart({ items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 });
      return;
    }

    const cartData = await api.get('/cart');
    renderCart(cartData);
  } catch (error) {
    console.error('Error fetching cart:', error);
    // Show empty cart on error
    renderCart({ items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 });
  }
};

const renderCart = (cartData) => {
  const container = $('#cartContainer');
  const emptyState = $('#emptyCartState');
  const summary = $('#cartSummary');
  const cartCount = $('#cartCount');
  
  if (!container || !emptyState || !summary || !cartCount) return;
  
  // Update cart counter
  const itemCount = cartData.items ? cartData.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  cartCount.textContent = itemCount;
  
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
    <div class="cart-row py-3 d-flex align-items-center border-bottom">
      <img src="${item.product.image}" 
           alt="${item.product.name}" 
           class="cart-item-img me-3"
           style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px;"
           onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFmMWYxZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4/PC90ZXh0Pjwvc3ZnPg=='">
      
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="mb-0">${item.product.name}</h6>
          <span class="fw-bold">${formatPrice(item.itemTotal)}</span>
        </div>
        
        <div class="d-flex align-items-center">
          <div class="input-group input-group-sm me-2" style="width: 120px;">
            <button class="btn btn-outline-secondary" type="button" 
                    onclick="updateCartQuantity('${item.productId}', ${Math.max(1, item.quantity - 1)})">
              <i class="bi bi-dash"></i>
            </button>
            <input type="number" class="form-control text-center" 
                   value="${item.quantity}" min="1" 
                   onchange="updateCartQuantity('${item.productId}', this.value)">
            <button class="btn btn-outline-secondary" type="button"
                    onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">
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
  const subtotalEl = $('#cartSubtotal');
  const taxEl = $('#cartTax');
  const shippingEl = $('#cartShipping');
  const totalEl = $('#cartTotal');
  
  if (subtotalEl) subtotalEl.textContent = formatPrice(cartData.subtotal || 0);
  if (taxEl) taxEl.textContent = formatPrice(cartData.tax || 0);
  if (shippingEl) shippingEl.textContent = cartData.shipping === 0 ? 'Free' : formatPrice(cartData.shipping || 0);
  if (totalEl) totalEl.textContent = formatPrice(cartData.total || 0);
};

const processCheckout = async () => {
  try {
    if (!currentUser) {
      showToast('Please login to checkout', 'error');
      window.location.href = '/login';
      return;
    }

    const result = await api.post('/checkout');
    showToast(`Order placed successfully! Order ID: ${result.orderId}`);
    await updateCartDisplay();
    
    // Close cart sidebar
    const cartCanvas = $('#cartCanvas');
    if (cartCanvas) {
      const cartOffcanvas = bootstrap.Offcanvas.getInstance(cartCanvas);
      if (cartOffcanvas) {
        cartOffcanvas.hide();
      }
    }
  } catch (error) {
    console.error('Checkout error:', error);
    showToast('Checkout failed. Please try again.', 'error');
  }
};

// Filter Functions
const applyFilters = () => {
  const searchInput = $('#searchInput');
  const categoryFilter = $('#categoryFilter');
  const minPrice = $('#minPrice');
  const maxPrice = $('#maxPrice');
  const sortFilter = $('#sortFilter');
  
  // Get current filter values
  if (searchInput) currentFilters.search = searchInput.value.trim();
  if (categoryFilter) currentFilters.category = categoryFilter.value;
  if (minPrice) currentFilters.minPrice = minPrice.value;
  if (maxPrice) currentFilters.maxPrice = maxPrice.value;
  
  if (sortFilter) {
    const sortValue = sortFilter.value;
    if (sortValue.includes(':')) {
      const [sortBy, sortOrder] = sortValue.split(':');
      currentFilters.sortBy = sortBy;
      currentFilters.sortOrder = sortOrder;
    }
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
  const searchInput = $('#searchInput');
  const categoryFilter = $('#categoryFilter');
  const sortFilter = $('#sortFilter');
  const minPrice = $('#minPrice');
  const maxPrice = $('#maxPrice');
  
  if (searchInput) searchInput.value = '';
  if (categoryFilter) categoryFilter.value = 'all';
  if (sortFilter) sortFilter.value = 'name:asc';
  if (minPrice) minPrice.value = '';
  if (maxPrice) maxPrice.value = '';
  
  fetchProducts();
};

const filterByCategory = (category) => {
  currentFilters.category = category;
  const categoryFilter = $('#categoryFilter');
  if (categoryFilter) categoryFilter.value = category;
  fetchProducts();
};

// Category Functions
const loadCategories = async () => {
  try {
    const categories = await api.get('/categories');
    const dropdown = $('#categoriesDropdown');
    const select = $('#categoryFilter');
    
    if (dropdown) {
      // Clear existing categories
      dropdown.innerHTML = '<li><a class="dropdown-item" href="#" data-category="all">All Products</a></li>';
    }
    
    if (select) {
      select.innerHTML = '<option value="all">All Categories</option>';
    }
    
    // Add categories
    categories.forEach(category => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      
      if (dropdown) {
        dropdown.innerHTML += `
          <li><a class="dropdown-item" href="#" data-category="${category}">${categoryName}</a></li>
        `;
      }
      
      if (select) {
        select.innerHTML += `<option value="${category}">${categoryName}</option>`;
      }
    });
    
    // Add event listeners to dropdown items
    if (dropdown) {
      $$('#categoriesDropdown a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const category = e.target.dataset.category;
          filterByCategory(category);
        });
      });
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};

// Scroll Functions
const scrollToProducts = () => {
  const productsSection = $('#productsSection');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const scrollToFilters = () => {
  const filtersSection = $('#filtersSection');
  if (filtersSection) {
    filtersSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Event Listeners
const initEventListeners = () => {
  // Search form
  const searchForm = $('#searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });
  }
  
  // Search input with debounce
  const searchInput = $('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      applyFilters();
    }, 500));
  }
  
  // Filter controls
  const categoryFilter = $('#categoryFilter');
  const sortFilter = $('#sortFilter');
  const minPrice = $('#minPrice');
  const maxPrice = $('#maxPrice');
  
  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (sortFilter) sortFilter.addEventListener('change', applyFilters);
  if (minPrice) minPrice.addEventListener('change', applyFilters);
  if (maxPrice) maxPrice.addEventListener('change', applyFilters);
  
  // Clear filters button
  const clearFiltersBtn = $('#clearFiltersBtn');
  const resetFiltersBtn = $('#resetFiltersBtn');
  
  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);
  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', clearFilters);
  
  // Hero buttons
  const startShoppingBtn = $('#startShoppingBtn');
  const browseCategoriesBtn = $('#browseCategoriesBtn');
  
  if (startShoppingBtn) startShoppingBtn.addEventListener('click', scrollToProducts);
  if (browseCategoriesBtn) browseCategoriesBtn.addEventListener('click', scrollToFilters);
  
  // Cart buttons
  const checkoutBtn = $('#checkoutBtn');
  const clearCartBtn = $('#clearCartBtn');
  
  if (checkoutBtn) checkoutBtn.addEventListener('click', processCheckout);
  if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
};

// Initialize Application
const initApp = async () => {
  try {
    // Check authentication (using your script.js checkAuth)
    await checkAuth();
    
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