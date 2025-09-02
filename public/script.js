// async function checkAuth() {
//   try {
//     const res = await fetch("/api/auth/me", { credentials: "include" });
//     if (!res.ok) throw new Error("Not authenticated");

//     const data = await res.json();
//     if (data.user) {
//       showLogoutButton(data.user.name);
//     } else {
//       showLoginButton();
//     }
//   } catch (err) {
//     showLoginButton();
//   }
// }

// function showLoginButton() {
//   document.getElementById("authButtons").innerHTML = `
//         <a href="/login" class="btn btn-login">Login</a>
//     <a href="/signup" class="btn btn-signup">Signup</a>
//   `;
// }

// function showLogoutButton(username) {
//   document.getElementById("authButtons").innerHTML = `
//     <span>Welcome, ${username}</span>
//     <button id="logoutBtn">Logout</button>
//   `;

//   document.getElementById("logoutBtn").addEventListener("click", async () => {
//     await fetch("/api/auth/logout", {
//       method: "POST",
//       credentials: "include"
//     });
//     checkAuth(); // refresh UI after logout
//   });
// }

// // Run on page load
// checkAuth();

// orignal code here 

async function checkAuth() {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) throw new Error("Not authenticated");

    const data = await res.json();
    if (data.user) {
      showLogoutButton(data.user.name);
    } else {
      showLoginButton();
    }
  } catch (err) {
    showLoginButton();
  }
}

function showLoginButton() {
  document.getElementById("authButtons").innerHTML = `
    <button class="btn btn-outline-light dropdown-toggle" type="button" id="authDropdown" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="bi bi-person-circle me-1"></i> Account
    </button>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="authDropdown">
      <li><a class="dropdown-item" href="/login">Login</a></li>
      <li><a class="dropdown-item" href="/signup">Signup</a></li>
    </ul>
  `;
}

function showLogoutButton(username) {
  document.getElementById("authButtons").innerHTML = `
    <button class="btn btn-outline-light dropdown-toggle" type="button" id="authDropdown" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="bi bi-person-circle me-1"></i> ${username}
    </button>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="authDropdown">
      <li><a class="dropdown-item" href="/profile">Profile</a></li>
      <li><a class="dropdown-item" href="/orders">Orders</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><button class="dropdown-item" id="logoutBtn">Logout</button></li>
    </ul>
  `;

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    checkAuth(); // refresh UI after logout
  });
}

// Run on page load
checkAuth();

// end of orignal code 



// claude updated Code below 

// Authentication functions
// async function checkAuth() {
//   try {
//     const res = await fetch("/api/auth/me", { 
//       credentials: "include",
//       method: "GET"
//     });
    
//     if (!res.ok) throw new Error("Not authenticated");

//     const data = await res.json();
//     if (data.user) {
//       showLogoutButton(data.user.name);
//       // Load user's cart when authenticated
//       loadCart();
//     } else {
//       showLoginButton();
//     }
//   } catch (err) {
//     console.log("Auth check failed:", err.message);
//     showLoginButton();
//   }
// }

// function showLoginButton() {
//   const authButtonsEl = document.getElementById("authButtons");
//   if (authButtonsEl) {
//     authButtonsEl.innerHTML = `
//       <button class="btn btn-outline-light dropdown-toggle" type="button" id="authDropdown" data-bs-toggle="dropdown" aria-expanded="false">
//         <i class="bi bi-person-circle me-1"></i> Account
//       </button>
//       <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="authDropdown">
//         <li><a class="dropdown-item" href="/login">Login</a></li>
//         <li><a class="dropdown-item" href="/signup">Signup</a></li>
//       </ul>
//     `;
//   }
// }

// function showLogoutButton(username) {
//   const authButtonsEl = document.getElementById("authButtons");
//   if (authButtonsEl) {
//     authButtonsEl.innerHTML = `
//       <button class="btn btn-outline-light dropdown-toggle" type="button" id="authDropdown" data-bs-toggle="dropdown" aria-expanded="false">
//         <i class="bi bi-person-circle me-1"></i> ${username}
//       </button>
//       <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="authDropdown">
//         <li><a class="dropdown-item" href="/profile">Profile</a></li>
//         <li><a class="dropdown-item" href="/orders">Orders</a></li>
//         <li><hr class="dropdown-divider"></li>
//         <li><button class="dropdown-item" id="logoutBtn">Logout</button></li>
//       </ul>
//     `;

//     // Add logout event listener
//     const logoutBtn = document.getElementById("logoutBtn");
//     if (logoutBtn) {
//       logoutBtn.addEventListener("click", async () => {
//         try {
//           await fetch("/api/auth/logout", {
//             method: "POST",
//             credentials: "include"
//           });
//           // Clear local cart and refresh UI
//           window.location.reload(); // Refresh page after logout
//         } catch (err) {
//           console.error("Logout error:", err);
//         }
//       });
//     }
//   }
// }

// // Load user's cart from database
// async function loadCart() {
//   try {
//     const response = await fetch('/api/cart', {
//       credentials: 'include'
//     });
    
//     if (response.ok) {
//       const cartData = await response.json();
//       // Update cart UI with user's cart data
//       updateCartDisplay(cartData);
//     }
//   } catch (error) {
//     console.error('Error loading cart:', error);
//   }
// }

// // Function to update cart display (implement according to your UI)
// function updateCartDisplay(cartData) {
//   // Update cart count in navbar
//   const cartCountEl = document.getElementById('cart-count');
//   if (cartCountEl) {
//     cartCountEl.textContent = cartData.itemCount || 0;
//   }
  
//   // Update cart sidebar/modal if open
//   // Add your cart UI update logic here
// }

// // Enhanced add to cart function
// async function addToCart(productId, quantity = 1) {
//   try {
//     const response = await fetch('/api/cart', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({ productId, quantity })
//     });

//     const result = await response.json();
    
//     if (response.ok) {
//       // Show success message
//       showToast(result.message || 'Item added to cart', 'success');
//       // Reload cart to update UI
//       loadCart();
//     } else {
//       showToast(result.error || 'Failed to add item', 'error');
//     }
//   } catch (error) {
//     console.error('Add to cart error:', error);
//     showToast('Please login to add items to cart', 'warning');
//   }
// }

// // Toast notification function
// function showToast(message, type = 'info') {
//   // Create toast element
//   const toast = document.createElement('div');
//   toast.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed`;
//   toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
//   toast.innerHTML = `
//     ${message}
//     <button type="button" class="btn-close float-end" onclick="this.parentElement.remove()"></button>
//   `;
  
//   document.body.appendChild(toast);
  
//   // Auto remove after 3 seconds
//   setTimeout(() => {
//     if (toast.parentElement) {
//       toast.remove();
//     }
//   }, 3000);
// }

// // Run authentication check on page load
// document.addEventListener('DOMContentLoaded', function() {
//   checkAuth();
// });

// // Make functions globally available
// window.addToCart = addToCart;
// window.checkAuth = checkAuth;



// claide code one 

// // Global variables
// let currentUser = null;
// let cart = { items: [], itemCount: 0, total: 0 };

// // Authentication functions
// async function checkAuth() {
//   try {
//     const res = await fetch("/api/auth/me", { 
//       credentials: "include",
//       method: "GET"
//     });
    
//     if (res.ok) {
//       const data = await res.json();
//       if (data.user) {
//         currentUser = data.user;
//         showLogoutButton(data.user.name);
//         await loadCart(); // Load user's cart
//         return;
//       }
//     }
    
//     // Not authenticated
//     currentUser = null;
//     showLoginButton();
//     clearCartDisplay();
//   } catch (err) {
//     console.log("Auth check failed:", err.message);
//     currentUser = null;
//     showLoginButton();
//     clearCartDisplay();
//   }
// }

// function showLoginButton() {
//   const authButtonText = document.getElementById("authButtonText");
//   const authDropdownMenu = document.getElementById("authDropdownMenu");
  
//   if (authButtonText) authButtonText.textContent = "Account";
  
//   if (authDropdownMenu) {
//     authDropdownMenu.innerHTML = `
//       <li><a class="dropdown-item" href="/login">Login</a></li>
//       <li><a class="dropdown-item" href="/signup">Signup</a></li>
//     `;
//   }
// }

// function showLogoutButton(username) {
//   const authButtonText = document.getElementById("authButtonText");
//   const authDropdownMenu = document.getElementById("authDropdownMenu");
  
//   if (authButtonText) authButtonText.textContent = username;
  
//   if (authDropdownMenu) {
//     authDropdownMenu.innerHTML = `
//       <li><a class="dropdown-item" href="/profile">Profile</a></li>
//       <li><a class="dropdown-item" href="/orders">Orders</a></li>
//       <li><hr class="dropdown-divider"></li>
//       <li><button class="dropdown-item" id="logoutBtn">Logout</button></li>
//     `;

//     // Add logout event listener
//     const logoutBtn = document.getElementById("logoutBtn");
//     if (logoutBtn) {
//       logoutBtn.addEventListener("click", async () => {
//         try {
//           await fetch("/api/auth/logout", {
//             method: "POST",
//             credentials: "include"
//           });
//           window.location.reload();
//         } catch (err) {
//           console.error("Logout error:", err);
//         }
//       });
//     }
//   }
// }

// // Cart functions
// async function loadCart() {
//   if (!currentUser) {
//     clearCartDisplay();
//     return;
//   }

//   try {
//     const response = await fetch('/api/cart', {
//       credentials: 'include'
//     });
    
//     if (response.ok) {
//       cart = await response.json();
//       updateCartDisplay();
//     } else {
//       clearCartDisplay();
//     }
//   } catch (error) {
//     console.error('Error loading cart:', error);
//     clearCartDisplay();
//   }
// }

// function updateCartDisplay() {
//   // Update cart count in navbar
//   const cartCountEl = document.getElementById('cartCount');
//   if (cartCountEl) {
//     cartCountEl.textContent = cart.itemCount || 0;
//     cartCountEl.style.display = (cart.itemCount > 0) ? 'inline' : 'none';
//   }
  
//   // Update cart sidebar if it exists
//   updateCartSidebar();
// }

// function clearCartDisplay() {
//   cart = { items: [], itemCount: 0, total: 0 };
//   const cartCountEl = document.getElementById('cartCount');
//   if (cartCountEl) {
//     cartCountEl.textContent = '0';
//     cartCountEl.style.display = 'none';
//   }
//   updateCartSidebar();
// }

// // Enhanced add to cart function
// async function addToCart(productId, quantity = 1) {
//   if (!currentUser) {
//     showToast('Please login to add items to cart', 'warning');
//     return;
//   }

//   try {
//     const response = await fetch('/api/cart', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({ productId, quantity })
//     });

//     const result = await response.json();
    
//     if (response.ok) {
//       showToast(result.message || 'Item added to cart', 'success');
//       await loadCart(); // Reload cart to update UI
//     } else {
//       showToast(result.error || 'Failed to add item', 'error');
//     }
//   } catch (error) {
//     console.error('Add to cart error:', error);
//     showToast('Error adding item to cart', 'error');
//   }
// }

// // Update cart quantity
// async function updateCartQuantity(productId, quantity) {
//   if (!currentUser) return;

//   try {
//     const response = await fetch(`/api/cart/${productId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({ quantity })
//     });

//     if (response.ok) {
//       await loadCart();
//     } else {
//       const result = await response.json();
//       showToast(result.error || 'Failed to update cart', 'error');
//     }
//   } catch (error) {
//     console.error('Update cart error:', error);
//     showToast('Error updating cart', 'error');
//   }
// }

// // Remove from cart
// async function removeFromCart(productId) {
//   if (!currentUser) return;

//   try {
//     const response = await fetch(`/api/cart/${productId}`, {
//       method: 'DELETE',
//       credentials: 'include'
//     });

//     if (response.ok) {
//       await loadCart();
//       showToast('Item removed from cart', 'info');
//     }
//   } catch (error) {
//     console.error('Remove from cart error:', error);
//     showToast('Error removing item', 'error');
//   }
// }

// // Clear entire cart
// async function clearCart() {
//   if (!currentUser) return;

//   try {
//     const response = await fetch('/api/cart', {
//       method: 'DELETE',
//       credentials: 'include'
//     });

//     if (response.ok) {
//       await loadCart();
//       showToast('Cart cleared', 'info');
//     }
//   } catch (error) {
//     console.error('Clear cart error:', error);
//   }
// }

// // Update cart sidebar
// function updateCartSidebar() {
//   const cartItemsEl = document.getElementById('cartItems');
//   const cartTotalEl = document.getElementById('cartTotal');
//   const cartSubtotalEl = document.getElementById('cartSubtotal');
//   const cartTaxEl = document.getElementById('cartTax');
//   const cartShippingEl = document.getElementById('cartShipping');

//   if (cartItemsEl) {
//     if (!cart.items || cart.items.length === 0) {
//       cartItemsEl.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
//     } else {
//       cartItemsEl.innerHTML = cart.items.map(item => `
//         <div class="cart-item d-flex align-items-center mb-3 p-2 border-bottom">
//           <img src="${item.product?.image || '/img/placeholder.jpg'}" alt="${item.product?.name}" class="cart-item-img me-3" style="width: 50px; height: 50px; object-fit: cover;">
//           <div class="flex-grow-1">
//             <h6 class="mb-1">${item.product?.name || 'Unknown Product'}</h6>
//             <small class="text-muted">$${item.product?.price?.toFixed(2) || '0.00'}</small>
//           </div>
//           <div class="d-flex align-items-center">
//             <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})">-</button>
//             <span class="mx-2">${item.quantity}</span>
//             <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
//             <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart('${item.productId}')">
//               <i class="bi bi-trash"></i>
//             </button>
//           </div>
//         </div>
//       `).join('');
//     }
//   }

//   // Update totals
//   if (cartSubtotalEl) cartSubtotalEl.textContent = `$${cart.subtotal?.toFixed(2) || '0.00'}`;
//   if (cartTaxEl) cartTaxEl.textContent = `$${cart.tax?.toFixed(2) || '0.00'}`;
//   if (cartShippingEl) cartShippingEl.textContent = `$${cart.shipping?.toFixed(2) || '0.00'}`;
//   if (cartTotalEl) cartTotalEl.textContent = `$${cart.total?.toFixed(2) || '0.00'}`;
// }

// // Toast notification function
// function showToast(message, type = 'info') {
//   // Remove existing toasts first
//   const existingToasts = document.querySelectorAll('.toast-notification');
//   existingToasts.forEach(toast => toast.remove());

//   const toast = document.createElement('div');
//   toast.className = `toast-notification alert alert-${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'} position-fixed`;
//   toast.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;';
//   toast.innerHTML = `
//     <div class="d-flex justify-content-between align-items-center">
//       <span>${message}</span>
//       <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
//     </div>
//   `;
  
//   document.body.appendChild(toast);
  
//   // Auto remove after 4 seconds
//   setTimeout(() => {
//     if (toast.parentElement) {
//       toast.remove();
//     }
//   }, 4000);
// }

// // Checkout function
// async function checkout() {
//   if (!currentUser) {
//     showToast('Please login to checkout', 'warning');
//     return;
//   }

//   if (!cart.items || cart.items.length === 0) {
//     showToast('Your cart is empty', 'warning');
//     return;
//   }

//   try {
//     const response = await fetch('/api/checkout', {
//       method: 'POST',
//       credentials: 'include'
//     });

//     const result = await response.json();
    
//     if (response.ok) {
//       showToast(`Order placed successfully! Order ID: ${result.orderId}`, 'success');
//       await loadCart(); // Reload empty cart
//       // Close cart sidebar
//       const cartCanvas = document.getElementById('cartCanvas');
//       if (cartCanvas) {
//         const bsOffcanvas = bootstrap.Offcanvas.getInstance(cartCanvas);
//         if (bsOffcanvas) bsOffcanvas.hide();
//       }
//     } else {
//       showToast(result.error || 'Checkout failed', 'error');
//     }
//   } catch (error) {
//     console.error('Checkout error:', error);
//     showToast('Checkout failed', 'error');
//   }
// }

// // Initialize on page load
// document.addEventListener('DOMContentLoaded', function() {
//   checkAuth();
  
//   // Add checkout button event listener if it exists
//   const checkoutBtn = document.getElementById('checkoutBtn');
//   if (checkoutBtn) {
//     checkoutBtn.addEventListener('click', checkout);
//   }
// });

// // Make functions globally available
// window.addToCart = addToCart;
// window.updateCartQuantity = updateCartQuantity;
// window.removeFromCart = removeFromCart;
// window.clearCart = clearCart;
// window.checkout = checkout;
// window.checkAuth = checkAuth;


// claude code 2 

// // Global variables
// let currentUser = null;
// let cart = { items: [], itemCount: 0, total: 0 };

// // Authentication functions
// async function checkAuth() {
//   try {
//     const res = await fetch("/api/auth/me", { 
//       credentials: "include",
//       method: "GET"
//     });
    
//     if (res.ok) {
//       const data = await res.json();
//       console.log("Auth check response:", data); // Debug log
//       if (data.user) {
//         currentUser = data.user;
//         console.log("Setting user:", data.user.name); // Debug log
//         showLogoutButton(data.user.name);
//         await loadCart(); // Load user's cart
//         return;
//       }
//     }
    
//     // Not authenticated
//     console.log("Not authenticated, showing login"); // Debug log
//     currentUser = null;
//     showLoginButton();
//     clearCartDisplay();
//   } catch (err) {
//     console.log("Auth check failed:", err.message);
//     currentUser = null;
//     showLoginButton();
//     clearCartDisplay();
//   }
// }

// function showLoginButton() {
//   console.log("Showing login button"); // Debug log
//   const authButtonText = document.getElementById("authButtonText");
//   const authDropdownMenu = document.getElementById("authDropdownMenu");
  
//   if (authButtonText) {
//     authButtonText.textContent = "Account";
//     console.log("Set button text to Account"); // Debug log
//   }
  
//   if (authDropdownMenu) {
//     authDropdownMenu.innerHTML = `
//       <li><a class="dropdown-item" href="/login">Login</a></li>
//       <li><a class="dropdown-item" href="/signup">Signup</a></li>
//     `;
//     console.log("Set login/signup menu"); // Debug log
//   }
// }

// function showLogoutButton(username) {
//   console.log("Showing logout button for:", username); // Debug log
//   const authButtonText = document.getElementById("authButtonText");
//   const authDropdownMenu = document.getElementById("authDropdownMenu");
  
//   if (authButtonText) {
//     authButtonText.textContent = username;
//     console.log("Set button text to:", username); // Debug log
//   } else {
//     console.error("authButtonText element not found!"); // Debug log
//   }
  
//   if (authDropdownMenu) {
//     authDropdownMenu.innerHTML = `
//       <li><a class="dropdown-item" href="/profile">Profile</a></li>
//       <li><a class="dropdown-item" href="/orders">Orders</a></li>
//       <li><hr class="dropdown-divider"></li>
//       <li><button class="dropdown-item" id="logoutBtn">Logout</button></li>
//     `;
//     console.log("Set logout menu"); // Debug log

//     // Add logout event listener
//     setTimeout(() => {
//       const logoutBtn = document.getElementById("logoutBtn");
//       if (logoutBtn) {
//         console.log("Adding logout event listener"); // Debug log
//         logoutBtn.addEventListener("click", async () => {
//           try {
//             console.log("Logout clicked"); // Debug log
//             await fetch("/api/auth/logout", {
//               method: "POST",
//               credentials: "include"
//             });
//             console.log("Logout successful, reloading page"); // Debug log
//             window.location.reload();
//           } catch (err) {
//             console.error("Logout error:", err);
//           }
//         });
//       } else {
//         console.error("Logout button not found after setting menu!"); // Debug log
//       }
//     }, 100); // Small delay to ensure DOM is updated
//   } else {
//     console.error("authDropdownMenu element not found!"); // Debug log
//   }
// }

// // Cart functions
// async function loadCart() {
//   if (!currentUser) {
//     clearCartDisplay();
//     return;
//   }

//   try {
//     const response = await fetch('/api/cart', {
//       credentials: 'include'
//     });
    
//     if (response.ok) {
//       cart = await response.json();
//       updateCartDisplay();
//     } else {
//       clearCartDisplay();
//     }
//   } catch (error) {
//     console.error('Error loading cart:', error);
//     clearCartDisplay();
//   }
// }

// function updateCartDisplay() {
//   // Update cart count in navbar
//   const cartCountEl = document.getElementById('cartCount');
//   if (cartCountEl) {
//     cartCountEl.textContent = cart.itemCount || 0;
//     cartCountEl.style.display = (cart.itemCount > 0) ? 'inline' : 'none';
//   }
  
//   // Update cart sidebar if it exists
//   updateCartSidebar();
// }

// function clearCartDisplay() {
//   cart = { items: [], itemCount: 0, total: 0 };
//   const cartCountEl = document.getElementById('cartCount');
//   if (cartCountEl) {
//     cartCountEl.textContent = '0';
//     cartCountEl.style.display = 'none';
//   }
//   updateCartSidebar();
// }

// // Enhanced add to cart function
// async function addToCart(productId, quantity = 1) {
//   if (!currentUser) {
//     showToast('Please login to add items to cart', 'warning');
//     return;
//   }

//   try {
//     const response = await fetch('/api/cart', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({ productId, quantity })
//     });

//     const result = await response.json();
    
//     if (response.ok) {
//       showToast(result.message || 'Item added to cart', 'success');
//       await loadCart(); // Reload cart to update UI
//     } else {
//       showToast(result.error || 'Failed to add item', 'error');
//     }
//   } catch (error) {
//     console.error('Add to cart error:', error);
//     showToast('Error adding item to cart', 'error');
//   }
// }

// // Update cart quantity
// async function updateCartQuantity(productId, quantity) {
//   if (!currentUser) return;

//   try {
//     const response = await fetch(`/api/cart/${productId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({ quantity })
//     });

//     if (response.ok) {
//       await loadCart();
//     } else {
//       const result = await response.json();
//       showToast(result.error || 'Failed to update cart', 'error');
//     }
//   } catch (error) {
//     console.error('Update cart error:', error);
//     showToast('Error updating cart', 'error');
//   }
// }

// // Remove from cart
// async function removeFromCart(productId) {
//   if (!currentUser) return;

//   try {
//     const response = await fetch(`/api/cart/${productId}`, {
//       method: 'DELETE',
//       credentials: 'include'
//     });

//     if (response.ok) {
//       await loadCart();
//       showToast('Item removed from cart', 'info');
//     }
//   } catch (error) {
//     console.error('Remove from cart error:', error);
//     showToast('Error removing item', 'error');
//   }
// }

// // Clear entire cart
// async function clearCart() {
//   if (!currentUser) return;

//   try {
//     const response = await fetch('/api/cart', {
//       method: 'DELETE',
//       credentials: 'include'
//     });

//     if (response.ok) {
//       await loadCart();
//       showToast('Cart cleared', 'info');
//     }
//   } catch (error) {
//     console.error('Clear cart error:', error);
//   }
// }

// // Update cart sidebar
// function updateCartSidebar() {
//   const cartItemsEl = document.getElementById('cartItems');
//   const cartTotalEl = document.getElementById('cartTotal');
//   const cartSubtotalEl = document.getElementById('cartSubtotal');
//   const cartTaxEl = document.getElementById('cartTax');
//   const cartShippingEl = document.getElementById('cartShipping');

//   if (cartItemsEl) {
//     if (!cart.items || cart.items.length === 0) {
//       cartItemsEl.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
//     } else {
//       cartItemsEl.innerHTML = cart.items.map(item => `
//         <div class="cart-item d-flex align-items-center mb-3 p-2 border-bottom">
//           <img src="${item.product?.image || '/img/placeholder.jpg'}" alt="${item.product?.name}" class="cart-item-img me-3" style="width: 50px; height: 50px; object-fit: cover;">
//           <div class="flex-grow-1">
//             <h6 class="mb-1">${item.product?.name || 'Unknown Product'}</h6>
//             <small class="text-muted">$${item.product?.price?.toFixed(2) || '0.00'}</small>
//           </div>
//           <div class="d-flex align-items-center">
//             <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})">-</button>
//             <span class="mx-2">${item.quantity}</span>
//             <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
//             <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart('${item.productId}')">
//               <i class="bi bi-trash"></i>
//             </button>
//           </div>
//         </div>
//       `).join('');
//     }
//   }

//   // Update totals
//   if (cartSubtotalEl) cartSubtotalEl.textContent = `$${cart.subtotal?.toFixed(2) || '0.00'}`;
//   if (cartTaxEl) cartTaxEl.textContent = `$${cart.tax?.toFixed(2) || '0.00'}`;
//   if (cartShippingEl) cartShippingEl.textContent = `$${cart.shipping?.toFixed(2) || '0.00'}`;
//   if (cartTotalEl) cartTotalEl.textContent = `$${cart.total?.toFixed(2) || '0.00'}`;
// }

// // Toast notification function
// function showToast(message, type = 'info') {
//   // Remove existing toasts first
//   const existingToasts = document.querySelectorAll('.toast-notification');
//   existingToasts.forEach(toast => toast.remove());

//   const toast = document.createElement('div');
//   toast.className = `toast-notification alert alert-${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'} position-fixed`;
//   toast.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;';
//   toast.innerHTML = `
//     <div class="d-flex justify-content-between align-items-center">
//       <span>${message}</span>
//       <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
//     </div>
//   `;
  
//   document.body.appendChild(toast);
  
//   // Auto remove after 4 seconds
//   setTimeout(() => {
//     if (toast.parentElement) {
//       toast.remove();
//     }
//   }, 4000);
// }

// // Checkout function
// async function checkout() {
//   if (!currentUser) {
//     showToast('Please login to checkout', 'warning');
//     return;
//   }

//   if (!cart.items || cart.items.length === 0) {
//     showToast('Your cart is empty', 'warning');
//     return;
//   }

//   try {
//     const response = await fetch('/api/checkout', {
//       method: 'POST',
//       credentials: 'include'
//     });

//     const result = await response.json();
    
//     if (response.ok) {
//       showToast(`Order placed successfully! Order ID: ${result.orderId}`, 'success');
//       await loadCart(); // Reload empty cart
//       // Close cart sidebar
//       const cartCanvas = document.getElementById('cartCanvas');
//       if (cartCanvas) {
//         const bsOffcanvas = bootstrap.Offcanvas.getInstance(cartCanvas);
//         if (bsOffcanvas) bsOffcanvas.hide();
//       }
//     } else {
//       showToast(result.error || 'Checkout failed', 'error');
//     }
//   } catch (error) {
//     console.error('Checkout error:', error);
//     showToast('Checkout failed', 'error');
//   }
// }

// // Initialize on page load
// document.addEventListener('DOMContentLoaded', function() {
//   checkAuth();
  
//   // Add checkout button event listener if it exists
//   const checkoutBtn = document.getElementById('checkoutBtn');
//   if (checkoutBtn) {
//     checkoutBtn.addEventListener('click', checkout);
//   }
// });

// // Make functions globally available
// window.addToCart = addToCart;
// window.updateCartQuantity = updateCartQuantity;
// window.removeFromCart = removeFromCart;
// window.clearCart = clearCart;
// window.checkout = checkout;
// window.checkAuth = checkAuth;




// claude code 2 

// // Global variables
// let currentUser = null;
// let cart = { items: [], itemCount: 0, total: 0 };

// // Authentication functions
// async function checkAuth() {
//   try {
//     const res = await fetch("/api/auth/me", { 
//       credentials: "include",
//       method: "GET"
//     });
    
//     if (res.ok) {
//       const data = await res.json();
//       console.log("Auth check response:", data); // Debug log
//       if (data.user) {
//         currentUser = data.user;
//         console.log("Setting user:", data.user.name); // Debug log
//         showLogoutButton(data.user.name);
//         await loadCart(); // Load user's cart
//         return;
//       }
//     }
    
//     // Not authenticated
//     console.log("Not authenticated, showing login"); // Debug log
//     currentUser = null;
//     showLoginButton();
//     clearCartDisplay();
//   } catch (err) {
//     console.log("Auth check failed:", err.message);
//     currentUser = null;
//     showLoginButton();
//     clearCartDisplay();
//   }
// }

// function showLoginButton() {
//   console.log("Showing login button"); // Debug log
//   const authButtonText = document.getElementById("authButtonText");
//   const authDropdownMenu = document.getElementById("authDropdownMenu");
  
//   if (authButtonText) {
//     authButtonText.textContent = "Account";
//     console.log("Set button text to Account"); // Debug log
//   }
  
//   if (authDropdownMenu) {
//     authDropdownMenu.innerHTML = `
//       <li><a class="dropdown-item" href="/login">Login</a></li>
//       <li><a class="dropdown-item" href="/signup">Signup</a></li>
//     `;
//     console.log("Set login/signup menu"); // Debug log
//   }
// }

// function showLogoutButton(username) {
//   console.log("Showing logout button for:", username); // Debug log
//   const authButtonText = document.getElementById("authButtonText");
//   const authDropdownMenu = document.getElementById("authDropdownMenu");
  
//   if (authButtonText) {
//     authButtonText.textContent = username;
//     console.log("Set button text to:", username); // Debug log
//   } else {
//     console.error("authButtonText element not found!"); // Debug log
//   }
  
//   if (authDropdownMenu) {
//     authDropdownMenu.innerHTML = `
//       <li><a class="dropdown-item" href="/profile">Profile</a></li>
//       <li><a class="dropdown-item" href="/orders">Orders</a></li>
//       <li><hr class="dropdown-divider"></li>
//       <li><button class="dropdown-item" id="logoutBtn">Logout</button></li>
//     `;
//     console.log("Set logout menu"); // Debug log

//     // Add logout event listener
//     setTimeout(() => {
//       const logoutBtn = document.getElementById("logoutBtn");
//       if (logoutBtn) {
//         console.log("Adding logout event listener"); // Debug log
//         logoutBtn.addEventListener("click", async () => {
//           try {
//             console.log("Logout clicked"); // Debug log
//             await fetch("/api/auth/logout", {
//               method: "POST",
//               credentials: "include"
//             });
//             console.log("Logout successful, reloading page"); // Debug log
//             window.location.reload();
//           } catch (err) {
//             console.error("Logout error:", err);
//           }
//         });
//       } else {
//         console.error("Logout button not found after setting menu!"); // Debug log
//       }
//     }, 100); // Small delay to ensure DOM is updated
//   } else {
//     console.error("authDropdownMenu element not found!"); // Debug log
//   }
// }

// // Cart functions
// async function loadCart() {
//   if (!currentUser) {
//     clearCartDisplay();
//     return;
//   }

//   try {
//     const response = await fetch('/api/cart', {
//       credentials: 'include'
//     });
    
//     if (response.ok) {
//       cart = await response.json();
//       updateCartDisplay();
//     } else {
//       clearCartDisplay();
//     }
//   } catch (error) {
//     console.error('Error loading cart:', error);
//     clearCartDisplay();
//   }
// }

// function updateCartDisplay() {
//   // Update cart count in navbar
//   const cartCountEl = document.getElementById('cartCount');
//   if (cartCountEl) {
//     cartCountEl.textContent = cart.itemCount || 0;
//     cartCountEl.style.display = (cart.itemCount > 0) ? 'inline' : 'none';
//   }
  
//   // Update cart sidebar if it exists
//   updateCartSidebar();
// }

// function clearCartDisplay() {
//   cart = { items: [], itemCount: 0, total: 0 };
//   const cartCountEl = document.getElementById('cartCount');
//   if (cartCountEl) {
//     cartCountEl.textContent = '0';
//     cartCountEl.style.display = 'none';
//   }
//   updateCartSidebar();
// }

// // Enhanced add to cart function
// async function addToCart(productId, quantity = 1) {
//   if (!currentUser) {
//     showToast('Please login to add items to cart', 'warning');
//     return;
//   }

//   try {
//     const response = await fetch('/api/cart', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({ productId, quantity })
//     });

//     const result = await response.json();
    
//     if (response.ok) {
//       showToast(result.message || 'Item added to cart', 'success');
//       await loadCart(); // Reload cart to update UI
//     } else {
//       showToast(result.error || 'Failed to add item', 'error');
//     }
//   } catch (error) {
//     console.error('Add to cart error:', error);
//     showToast('Error adding item to cart', 'error');
//   }
// }

// // Update cart quantity
// async function updateCartQuantity(productId, quantity) {
//   if (!currentUser) return;

//   try {
//     const response = await fetch(`/api/cart/${productId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify({ quantity })
//     });

//     if (response.ok) {
//       await loadCart();
//     } else {
//       const result = await response.json();
//       showToast(result.error || 'Failed to update cart', 'error');
//     }
//   } catch (error) {
//     console.error('Update cart error:', error);
//     showToast('Error updating cart', 'error');
//   }
// }

// // Remove from cart
// async function removeFromCart(productId) {
//   if (!currentUser) return;

//   try {
//     const response = await fetch(`/api/cart/${productId}`, {
//       method: 'DELETE',
//       credentials: 'include'
//     });

//     if (response.ok) {
//       await loadCart();
//       showToast('Item removed from cart', 'info');
//     }
//   } catch (error) {
//     console.error('Remove from cart error:', error);
//     showToast('Error removing item', 'error');
//   }
// }

// // Clear entire cart
// async function clearCart() {
//   if (!currentUser) return;

//   try {
//     const response = await fetch('/api/cart', {
//       method: 'DELETE',
//       credentials: 'include'
//     });

//     if (response.ok) {
//       await loadCart();
//       showToast('Cart cleared', 'info');
//     }
//   } catch (error) {
//     console.error('Clear cart error:', error);
//   }
// }

// // Update cart sidebar
// function updateCartSidebar() {
//   const cartItemsEl = document.getElementById('cartItems');
//   const cartTotalEl = document.getElementById('cartTotal');
//   const cartSubtotalEl = document.getElementById('cartSubtotal');
//   const cartTaxEl = document.getElementById('cartTax');
//   const cartShippingEl = document.getElementById('cartShipping');

//   if (cartItemsEl) {
//     if (!cart.items || cart.items.length === 0) {
//       cartItemsEl.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
//     } else {
//       cartItemsEl.innerHTML = cart.items.map(item => `
//         <div class="cart-item d-flex align-items-center mb-3 p-2 border-bottom">
//           <img src="${item.product?.image || '/img/placeholder.jpg'}" alt="${item.product?.name}" class="cart-item-img me-3" style="width: 50px; height: 50px; object-fit: cover;">
//           <div class="flex-grow-1">
//             <h6 class="mb-1">${item.product?.name || 'Unknown Product'}</h6>
//             <small class="text-muted">$${item.product?.price?.toFixed(2) || '0.00'}</small>
//           </div>
//           <div class="d-flex align-items-center">
//             <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})">-</button>
//             <span class="mx-2">${item.quantity}</span>
//             <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
//             <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart('${item.productId}')">
//               <i class="bi bi-trash"></i>
//             </button>
//           </div>
//         </div>
//       `).join('');
//     }
//   }

//   // Update totals
//   if (cartSubtotalEl) cartSubtotalEl.textContent = `$${cart.subtotal?.toFixed(2) || '0.00'}`;
//   if (cartTaxEl) cartTaxEl.textContent = `$${cart.tax?.toFixed(2) || '0.00'}`;
//   if (cartShippingEl) cartShippingEl.textContent = `$${cart.shipping?.toFixed(2) || '0.00'}`;
//   if (cartTotalEl) cartTotalEl.textContent = `$${cart.total?.toFixed(2) || '0.00'}`;
// }

// // Toast notification function
// function showToast(message, type = 'info') {
//   // Remove existing toasts first
//   const existingToasts = document.querySelectorAll('.toast-notification');
//   existingToasts.forEach(toast => toast.remove());

//   const toast = document.createElement('div');
//   toast.className = `toast-notification alert alert-${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'} position-fixed`;
//   toast.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;';
//   toast.innerHTML = `
//     <div class="d-flex justify-content-between align-items-center">
//       <span>${message}</span>
//       <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
//     </div>
//   `;
  
//   document.body.appendChild(toast);
  
//   // Auto remove after 4 seconds
//   setTimeout(() => {
//     if (toast.parentElement) {
//       toast.remove();
//     }
//   }, 4000);
// }

// // Checkout function
// async function checkout() {
//   if (!currentUser) {
//     showToast('Please login to checkout', 'warning');
//     return;
//   }

//   if (!cart.items || cart.items.length === 0) {
//     showToast('Your cart is empty', 'warning');
//     return;
//   }

//   try {
//     const response = await fetch('/api/checkout', {
//       method: 'POST',
//       credentials: 'include'
//     });

//     const result = await response.json();
    
//     if (response.ok) {
//       showToast(`Order placed successfully! Order ID: ${result.orderId}`, 'success');
//       await loadCart(); // Reload empty cart
//       // Close cart sidebar
//       const cartCanvas = document.getElementById('cartCanvas');
//       if (cartCanvas) {
//         const bsOffcanvas = bootstrap.Offcanvas.getInstance(cartCanvas);
//         if (bsOffcanvas) bsOffcanvas.hide();
//       }
//     } else {
//       showToast(result.error || 'Checkout failed', 'error');
//     }
//   } catch (error) {
//     console.error('Checkout error:', error);
//     showToast('Checkout failed', 'error');
//   }
// }

// // Initialize on page load
// document.addEventListener('DOMContentLoaded', function() {
//   // Wait a bit before checking auth to ensure page is fully loaded
//   setTimeout(() => {
//     checkAuth();
//   }, 500);
  
//   // Add checkout button event listener if it exists
//   const checkoutBtn = document.getElementById('checkoutBtn');
//   if (checkoutBtn) {
//     checkoutBtn.addEventListener('click', checkout);
//   }
// });

// // Make functions globally available
// window.addToCart = addToCart;
// window.updateCartQuantity = updateCartQuantity;
// window.removeFromCart = removeFromCart;
// window.clearCart = clearCart;
// window.checkout = checkout;
// window.checkAuth = checkAuth;

