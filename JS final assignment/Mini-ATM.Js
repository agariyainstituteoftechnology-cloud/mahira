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
    window.location.href = "index.html";
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
