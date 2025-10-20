// Register.js

 document.getElementById('registerForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const fullname = document.getElementById('fullname').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();
      const message = document.getElementById('message');

      if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        message.classList.remove("hidden", "text-green-600");
        message.classList.add("text-red-600");
        return;
      }

      // Get old users from localStorage
      let users = JSON.parse(localStorage.getItem('users')) || [];

      // Check if email already exists
      const userExists = users.some(user => user.email === email);
      if (userExists) {
        message.textContent = "Email already registered!";
        message.classList.remove("hidden", "text-green-600");
        message.classList.add("text-red-600");
        return;
      }

      // Add new user
      users.push({ fullname, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      // Success message
      message.textContent = "Registration successful!";
      message.classList.remove("hidden", "text-red-600");
      message.classList.add("text-green-600");

      // Clear form
      document.getElementById('registerForm').reset();

      // Redirect after 2 sec
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    });

//Login.js

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const message = document.getElementById('loginMessage');

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      message.textContent = "Login successful! Redirecting...";
      message.classList.remove("hidden", "text-red-600");
      message.classList.add("text-green-600");
      setTimeout(() => {
         window.location.href = "dashboard.html"; // your main dashboard page
      }, 1500);
    } else {
      message.textContent = "Invalid email or password!";
      message.classList.remove("hidden", "text-green-600");
      message.classList.add("text-red-600");
  }
});
  
//Dasboard.js

  let balance = parseFloat(localStorage.getItem("balance")) || 0;
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const balanceDisplay = document.getElementById("currentBalance");
  const depositBtn = document.getElementById("depositBtn");
  const depositInput = document.getElementById("depositAmount");
  const transactionTable = document.getElementById("transactionTable");

  function updateBalance() {
    balanceDisplay.textContent = `$${balance.toFixed(2)}`;
    localStorage.setItem("balance", balance);
  }

  function renderTransactions() {
    transactionTable.innerHTML = "";
    const recent = transactions.slice(-6).reverse();

    recent.forEach(tx => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="${tx.type === 'Deposit' ? 'text-green-600' : 'text-red-600'} font-semibold">${tx.type}</td>
        <td>$${tx.amount.toFixed(2)}</td>
        <td>${new Date(tx.date).toLocaleString()}</td>
      `;
      transactionTable.appendChild(row);
    });
  }

  depositBtn.addEventListener("click", () => {
    const amount = parseFloat(depositInput.value);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    balance += amount;
    transactions.push({
      type: "Deposit",
      amount: amount,
      date: new Date().toISOString()
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateBalance();
    renderTransactions();
    renderChart();
    depositInput.value = "";
  });

  // Chart
  let chart;
  function renderChart() {
    const deposits = transactions.filter(t => t.type === "Deposit").map(t => t.amount);
    const withdraws = transactions.filter(t => t.type === "Withdraw").map(t => t.amount);

    const ctx = document.getElementById("transactionChart").getContext("2d");
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Deposits", "Withdraws"],
        datasets: [
          {
            label: "Total",
            data: [
              deposits.reduce((a, b) => a + b, 0),
              withdraws.reduce((a, b) => a + b, 0)
            ],
            backgroundColor: ["#805ad5", "#e53e3e"],
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Initialize
  updateBalance();
  renderTransactions();
  renderChart();

//Deposit.js  
document.addEventListener("DOMContentLoaded", function () {
  const depositForm = document.getElementById("depositForm");
  const message = document.getElementById("message");

  depositForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);

    if (!username || isNaN(amount) || amount <= 0) {
      alert("Please enter valid details!");
      return;
    }

    // Get existing data
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) {
      alert("User not found! Please register first.");
      return;
    }

    // Update balance
    users[userIndex].balance = (users[userIndex].balance || 0) + amount;
    localStorage.setItem("users", JSON.stringify(users));

    // Show message
    message.textContent = `Successfully deposited $${amount.toFixed(2)} to ${username}'s account.`;
    message.classList.remove("hidden");

    // Reset form
    depositForm.reset();

    // Hide message after 3 seconds
    setTimeout(() => {
      message.classList.add("hidden");
    }, 3000);
  });
});


// withdraw.js

// Balance localStorage se get karein (agar available ho)
let Balance = localStorage.getItem("balance") ? parseFloat(localStorage.getItem("balance")) : 5000; // default Rs. 5000

// Balance display karein
document.getElementById("balanceDisplay").textContent = balance.toFixed(2);

// Withdraw button click event
document.getElementById("withdrawBtn").addEventListener("click", function () {
  const amount = parseFloat(document.getElementById("withdrawAmount").value);
  const message = document.getElementById("message");

  // Validation
  if (isNaN(amount) || amount <= 0) {
    message.textContent = "⚠️ Please enter a valid amount!";
    message.className = "text-red-500 mt-4 font-semibold text-center";
    return;
  }

  // Check for sufficient balance
  if (amount > balance) {
    message.textContent = "❌ Insufficient Balance!";
    message.className = "text-red-600 mt-4 font-semibold text-center";
    return;
  }

  // Withdraw process
  balance -= amount;
  localStorage.setItem("balance", balance.toFixed(2)); // update in localStorage
  document.getElementById("balanceDisplay").textContent = balance.toFixed(2);
  document.getElementById("withdrawAmount").value = "";

  message.textContent = `✅ Successfully withdrawn Rs. ${amount.toFixed(2)}!`;
  message.className = "text-green-600 mt-4 font-semibold text-center";
});


// transfer.js

document.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("userSelect");
  const transferAmount = document.getElementById("transferAmount");
  const transferBtn = document.getElementById("transferBtn");
  const message = document.getElementById("message");

  // Get users, logged-in user, and transactions
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  // Filter other users
  const otherUsers = users.filter(u => u.email !== currentUser.email);

  // Populate dropdown
  otherUsers.forEach(user => {
    const option = document.createElement("option");
    option.value = user.email;
    option.textContent = `${user.name} (${user.email})`;
    userSelect.appendChild(option);
  });

  // Transfer button logic
  transferBtn.addEventListener("click", () => {
    const selectedEmail = userSelect.value;
    const amount = parseFloat(transferAmount.value);

    if (!selectedEmail || isNaN(amount) || amount <= 0) {
      message.textContent = "⚠️ Please select a user and enter a valid amount.";
      message.className = "text-red-600 font-semibold text-center mt-4";
      return;
    }

    if (currentUser.balance < amount) {
      message.textContent = "❌ Insufficient balance!";
      message.className = "text-red-600 font-semibold text-center mt-4";
      return;
    }

    // Receiver
    const receiver = users.find(u => u.email === selectedEmail);

    // Update balances
    currentUser.balance -= amount;
    receiver.balance = (receiver.balance || 0) + amount;

    // Save updated data
    users = users.map(u => (u.email === currentUser.email ? currentUser : u.email === receiver.email ? receiver : u));
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));

    // Create transaction records
    const now = new Date().toLocaleString();

    const senderRecord = {
      email: currentUser.email,
      type: "Sent",
      to: receiver.email,
      amount,
      date: now
    };

    const receiverRecord = {
      email: receiver.email,
      type: "Received",
      from: currentUser.email,
      amount,
      date: now
    };

    transactions.push(senderRecord, receiverRecord);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Success message
    message.textContent = `✅ Transferred $${amount.toFixed(2)} to ${receiver.name}`;
    message.className = "text-green-600 font-semibold text-center mt-4";

    // Reset fields
    transferAmount.value = "";
    userSelect.value = "";
  });
});


// history.js

document.addEventListener("DOMContentLoaded", function () {
  const historyBody = document.getElementById("historyBody");

  // LocalStorage se transactions nikaal rahe hain
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  if (transactions.length === 0) {
    historyBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-6 text-gray-500">
          No transaction history available.
        </td>
      </tr>`;
    return;
  }

  transactions.forEach((t, index) => {
    const row = document.createElement("tr");
    row.classList.add("border-b", "hover:bg-purple-50");
    row.innerHTML = `
      <td class="py-3 px-4 font-semibold">${index + 1}</td>
      <td class="py-3 px-4">${t.date}</td>
      <td class="py-3 px-4 ${t.type === "Deposit" ? "text-green-600" : "text-red-600"}">
        ${t.type}
      </td>
      <td class="py-3 px-4">$${t.amount}</td>
      <td class="py-3 px-4 font-medium">$${t.balance}</td>
    `;
    historyBody.appendChild(row);
  });
});
