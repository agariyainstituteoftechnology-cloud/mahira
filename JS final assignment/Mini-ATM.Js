// Register.js
if (
  document.getElementById("registerForm") &&
  document.getElementById("registerForm").length > 0
) {
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document
        .getElementById("confirmPassword")
        .value.trim();
      const message = document.getElementById("message");

      if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        message.classList.remove("hidden", "text-green-600");
        message.classList.add("text-red-600");
        return;
      }

      // Get old users from localStorage
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if email already exists
      const userExists = users.some((user) => user.email === email);
      if (userExists) {
        message.textContent = "Email already registered!";
        message.classList.remove("hidden", "text-green-600");
        message.classList.add("text-red-600");
        return;
      }

      // Add new user
      users.push({ fullname, email, password });
      localStorage.setItem("users", JSON.stringify(users));

      // Success message
      message.textContent = "Registration successful!";
      message.classList.remove("hidden", "text-red-600");
      message.classList.add("text-green-600");

      // Clear form
      document.getElementById("registerForm").reset();

      // Redirect after 2 sec
      setTimeout(() => {
        window.location.href = "loginn.html";
      }, 2000);
    });
}

//Login.js

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const message = document.getElementById("loginMessage");

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(
    (u) => u.email === email && u.password === password
  );

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

  recent.forEach((tx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="${
          tx.type === "Deposit" ? "text-green-600" : "text-red-600"
        } font-semibold">${tx.type}</td>
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
    date: new Date().toISOString(),
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateBalance();
  renderTransactions();
  renderChart();
  depositInput.value = "";
});

// Initialize
updateBalance();
renderTransactions();
renderChart();

//Deposit.js
// deposit.js
document.addEventListener("DOMContentLoaded", () => {
  const balanceEl = document.getElementById("currentBalance");
  const form = document.getElementById("depositForm");
  const amountInput = document.getElementById("depositAmount");
  const msg = document.getElementById("message");

  if (!balanceEl || !form || !amountInput || !msg) {
    console.error(
      "One or more required elements are missing. Check element IDs."
    );
    return;
  }

  // Load balance from localStorage (use Number to convert from string)
  let stored = localStorage.getItem("currentBalance");
  let currentBalance =
    stored !== null && !isNaN(Number(stored)) ? Number(stored) : 1000;
  localStorage.setItem("currentBalance", currentBalance);

  function updateBalanceUI() {
    balanceEl.textContent = `$${Number(currentBalance).toFixed(2)}`;
  }

  updateBalanceUI();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.className = "mt-4 text-center font-semibold";

    const val = amountInput.value.trim();
    const depositAmount = parseFloat(val);

    if (!val || !isFinite(depositAmount) || depositAmount <= 0) {
      msg.textContent = "Please enter a valid amount greater than 0.";
      msg.className += " text-red-600";
      return;
    }

    // Update balance
    currentBalance = Number(currentBalance) + Number(depositAmount);
    localStorage.setItem("currentBalance", currentBalance);

    // Update UI
    updateBalanceUI();
    msg.textContent = `Successfully deposited $${depositAmount.toFixed(2)}!`;
    msg.className += " text-green-600";

    // Clear input
    amountInput.value = "";

    // optional: dispatch a custom event (same page) and storage event will notify other tabs
    window.dispatchEvent(new Event("balanceUpdated"));
  });

  // If another tab/page updates localStorage, reflect the change here
  window.addEventListener("storage", (e) => {
    if (e.key === "currentBalance") {
      currentBalance =
        e.newValue !== null ? Number(e.newValue) : currentBalance;
      updateBalanceUI();
    }
  });

  // If dashboard element on same page uses a different ID (e.g., dashboardBalance), update it too
  window.addEventListener("balanceUpdated", () => {
    const dash = document.getElementById("dashboardBalance");
    if (dash) dash.textContent = `$${Number(currentBalance).toFixed(2)}`;
  });
});

// withdraw.js

// Balance localStorage se get karein (agar available ho)
let Balance = localStorage.getItem("balance")
  ? parseFloat(localStorage.getItem("balance"))
  : 5000; // default Rs. 5000

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
  const otherUsers = users.filter((u) => u.email !== currentUser.email);

  // Populate dropdown
  otherUsers.forEach((user) => {
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
    const receiver = users.find((u) => u.email === selectedEmail);

    // Update balances
    currentUser.balance -= amount;
    receiver.balance = (receiver.balance || 0) + amount;

    // Save updated data
    users = users.map((u) =>
      u.email === currentUser.email
        ? currentUser
        : u.email === receiver.email
        ? receiver
        : u
    );
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));

    // Create transaction records
    const now = new Date().toLocaleString();

    const senderRecord = {
      email: currentUser.email,
      type: "Sent",
      to: receiver.email,
      amount,
      date: now,
    };

    const receiverRecord = {
      email: receiver.email,
      type: "Received",
      from: currentUser.email,
      amount,
      date: now,
    };

    transactions.push(senderRecord, receiverRecord);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Success message
    message.textContent = `✅ Transferred $${amount.toFixed(2)} to ${
      receiver.name
    }`;
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
      <td class="py-3 px-4 ${
        t.type === "Deposit" ? "text-green-600" : "text-red-600"
      }">
        ${t.type}
      </td>
      <td class="py-3 px-4">$${t.amount}</td>
      <td class="py-3 px-4 font-medium">$${t.balance}</td>
    `;
    historyBody.appendChild(row);
  });
});
