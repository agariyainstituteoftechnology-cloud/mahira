// Register new user and store in localStorage
document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const msg = document.getElementById("message");

  // Validation
  if (password !== confirmPassword) {
    msg.textContent = "Passwords do not match!";
    msg.className = "msg error";
    return;
  }

  // Get existing users or empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if username already exists
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    msg.textContent = "Username already exists. Please choose another.";
    msg.className = "msg error";
    return;
  }

  // Create new user object
  const newUser = {
    username: username,
    password: password,
    balance: 0,
    transactions: []
  };

  // Add new user to users array
  users.push(newUser);

  // Save back to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  msg.textContent = "Registration successful!";
  msg.className = "msg success";

  // Clear form after success
  document.getElementById("registerForm").reset();

  // Redirect to login after short delay
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
