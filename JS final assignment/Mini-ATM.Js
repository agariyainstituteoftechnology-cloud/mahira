// Register.js

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const message = document.getElementById("message");

  // Validation
  if (!username || !password || !confirmPassword) {
    message.style.color = "yellow";
    message.textContent = "Please fill all fields.";
    return;
  }

  if (password !== confirmPassword) {
    message.style.color = "red";
    message.textContent = "Passwords do not match!";
    return;
  }

  // Fetch existing users from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if username already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    message.style.color = "red";
    message.textContent = "Username already exists!";
    return;
  }

  // Create new user object
  const newUser = {
    username,
    password,
    balance: 0,
    transactions: []
  };

  // Save user
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Success message
  message.style.color = "lightgreen";
  message.textContent = "Registration successful! Redirecting...";

  // Redirect to login after delay
  setTimeout(() => {
    window.location.href = "loginn.html";
  }, 1500);
});

// login.js

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (!username || !password) {
    message.style.color = "yellow";
    message.textContent = "Please fill in all fields.";
    return;
  }

  // Get stored users
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Find user
  const foundUser = users.find(u => u.username === username && u.password === password);

  if (!foundUser) {
    message.style.color = "red";
    message.textContent = "Invalid username or password!";
    return;
  }

  // Save current logged-in user
  localStorage.setItem("currentUser", JSON.stringify(foundUser.username));

  // Success message
  message.style.color = "lightgreen";
  message.textContent = "Login successful! Redirecting...";

  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1500);
});


// Dashboard.js

// Get logged-in user
const currentUserName = JSON.parse(localStorage.getItem("currentUser"));
const allUsers = JSON.parse(localStorage.getItem("users")) || [];
const user = allUsers.find(u => u.username === currentUserName);

// If not logged in, redirect to login
if (!user) {
  window.location.href = "loginn.html";
}

// Display username and balance
document.getElementById("userName").textContent = user.username;
document.getElementById("balanceAmount").textContent = user.balance;

// --- Logout button ---
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "loginn.html";
});

// --- Transaction History (last 6) ---
const transactionList = document.getElementById("transactionList");
const recentTransactions = user.transactions.slice(-6).reverse();

if (recentTransactions.length === 0) {
  transactionList.innerHTML = `<tr><td colspan="3">No transactions yet</td></tr>`;
} else {
  transactionList.innerHTML = recentTransactions
    .map(
      (t) => `
      <tr>
        <td>${t.type}</td>
        <td>${t.amount}</td>
        <td>${t.date}</td>
      </tr>
    `
    )
    .join("");
}

// --- View All Button ---
document.getElementById("viewAllBtn").addEventListener("click", () => {
  window.location.href = "history.html";
});

// --- Chart.js Graph ---
const deposits = user.transactions.filter(t => t.type === "Deposit").length;
const withdrawals = user.transactions.filter(t => t.type === "Withdraw").length;

new Chart(document.getElementById("transactionChart"), {
  type: "bar",
  data: {
    labels: ["Deposits", "Withdrawals"],
    datasets: [
      {
        label: "Transactions Count",
        data: [deposits, withdrawals],
        backgroundColor: ["#06d6a0", "#ef476f"],
        borderRadius: 6
      }
    ]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.2)" }
      },
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" }
      }
    },
    plugins: {
      legend: {
        labels: { color: "#fff" }
      }
    }
  }
});
