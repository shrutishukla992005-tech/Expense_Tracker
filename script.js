const form = document.getElementById("transactionForm");

const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");
const transactionCount = document.getElementById("transactionCount");
const search = document.getElementById("search");
const currentDate = document.getElementById("currentDate");


// Current Date
const today = new Date();

date.value = today.toISOString().split("T")[0];

currentDate.textContent = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});


// Get Data from Local Storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


// Category Icons
const icons = {
    Food: "🍔",
    Shopping: "🛍️",
    Transport: "🚗",
    Bills: "💡",
    Entertainment: "🎬",
    Health: "❤️",
    Education: "📚",
    Other: "📦"
};


// Add Transaction
form.addEventListener("submit", function (e) {

    e.preventDefault();

    const transaction = {
        id: Date.now(),
        description: description.value.trim(),
        amount: Number(amount.value),
        type: type.value,
        category: category.value,
        date: date.value
    };

    transactions.push(transaction);

    saveData();

    form.reset();

    date.value = today.toISOString().split("T")[0];

    renderTransactions();
});


// Save Data
function saveData() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// Calculate Summary
function updateSummary() {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    const balance = income - expense;

    incomeElement.textContent = formatCurrency(income);
    expenseElement.textContent = formatCurrency(expense);
    balanceElement.textContent = formatCurrency(balance);
}


// Currency Format
function formatCurrency(value) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(value);
}


// Display Transactions
function renderTransactions() {

    const searchValue = search.value.toLowerCase();

    const filteredTransactions = transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchValue) ||
        transaction.category.toLowerCase().includes(searchValue)
    );

    transactionList.innerHTML = "";

    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <div class="empty">
                <div>💸</div>
                <h3>No transactions found</h3>
                <p>Try adding a transaction or changing your search.</p>
            </div>
        `;

    } else {

        filteredTransactions
            .slice()
            .reverse()
            .forEach(transaction => {

                const item = document.createElement("div");

                item.className = "transaction";

                const sign = transaction.type === "income" ? "+" : "-";

                item.innerHTML = `
                    <div class="transaction-left">

                        <div class="category-icon">
                            ${icons[transaction.category] || "📦"}
                        </div>

                        <div class="transaction-info">
                            <h3>${transaction.description}</h3>
                            <p>
                                ${transaction.category} • 
                                ${formatDate(transaction.date)}
                            </p>
                        </div>

                    </div>

                    <div class="transaction-right">

                        <span class="amount ${transaction.type}">
                            ${sign}${formatCurrency(transaction.amount)}
                        </span>

                        <button 
                            class="delete-btn"
                            onclick="deleteTransaction(${transaction.id})"
                        >
                            🗑
                        </button>

                    </div>
                `;

                transactionList.appendChild(item);
            });
    }

    transactionCount.textContent =
        `${transactions.length} transaction${transactions.length !== 1 ? "s" : ""}`;

    updateSummary();
}


// Format Date
function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// Delete Transaction
function deleteTransaction(id) {

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveData();

    renderTransactions();
}


// Search
search.addEventListener("input", renderTransactions);


// Initial Display
renderTransactions();