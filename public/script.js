
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
