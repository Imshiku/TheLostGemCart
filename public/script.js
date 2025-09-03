



async function checkAuth() {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) throw new Error("Not authenticated");

    const data = await res.json();
    if (data.user) {
      showLogoutButton(data.user.name, data.user.profilePicture);
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

function showLogoutButton(username, profilePicture) {
  const profileImg = profilePicture 
    ? `<img src="${profilePicture}" alt="Profile" class="rounded-circle me-1" style="width: 24px; height: 24px;">`
    : `<i class="bi bi-person-circle me-1"></i>`;

  document.getElementById("authButtons").innerHTML = `
    <button class="btn btn-outline-light dropdown-toggle" type="button" id="authDropdown" data-bs-toggle="dropdown" aria-expanded="false">
      ${profileImg} ${username}
    </button>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="authDropdown">
      <li><a class="dropdown-item" href="/profile">Profile</a></li>
      <li><a class="dropdown-item" href="/orders">Orders</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><button class="dropdown-item" id="logoutBtn">Logout</button></li>
    </ul>
  `;

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
      // Logout from our backend
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      // Force Google account selection on next login by clearing any cached tokens
      // This helps with the "same account auto-login" issue
      if ('google' in window && 'accounts' in window.google) {
        window.google.accounts.id.disableAutoSelect();
      }

      // Clear any browser storage that might cache Google auth
      if (typeof(Storage) !== "undefined") {
        // Clear localStorage and sessionStorage (if they exist)
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch(e) {
          // Ignore errors if storage is not available
        }
      }

      // Redirect to clear any URL parameters and refresh the page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout error:', error);
      // Force refresh even if logout request failed
      window.location.href = '/';
    }
  });
}

// Run on page load
checkAuth();