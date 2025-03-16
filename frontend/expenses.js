document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expenseForm");
    const expenseTable = document.getElementById("expenseTable");
    const emptyState = document.getElementById("emptyState");
    const totalExpensesEl = document.getElementById("totalExpenses");
    const averageExpenseEl = document.getElementById("averageExpense");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const currentDateEl = document.getElementById("currentDate");

    // Set current date
    const today = new Date();
    currentDateEl.textContent = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById("expenseDate").valueAsDate = today;

    // Category icons mapping
    const categoryIcons = {
        "Food": "fa-utensils",
        "Transport": "fa-car",
        "Shopping": "fa-shopping-bag",
        "Entertainment": "fa-film",
        "Housing": "fa-home",
        "Utilities": "fa-bolt",
        "Health": "fa-heartbeat",
        "Travel": "fa-plane",
        "Other": "fa-ellipsis-h"
    };

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Calculate statistics
    function calculateStats(expenses) {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const average = expenses.length > 0 ? total / expenses.length : 0;
        
        totalExpensesEl.textContent = formatCurrency(total);
        averageExpenseEl.textContent = formatCurrency(average);
    }

    // Toggle empty state
    function toggleEmptyState(expenses) {
        if (expenses.length === 0) {
            emptyState.classList.remove("hidden");
            expenseTable.parentElement.parentElement.classList.add("hidden");
        } else {
            emptyState.classList.add("hidden");
            expenseTable.parentElement.parentElement.classList.remove("hidden");
        }
    }

    // Fetch and display existing expenses
    function loadExpenses() {
        fetch("http://localhost:5000/expenses")
            .then(response => response.json())
            .then(data => {
                expenseTable.innerHTML = "";
                
                // Sort expenses by date (newest first)
                data.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
                
                data.forEach(expense => {
                    const categoryIcon = categoryIcons[expense.category] || "fa-tag";
                    const row = document.createElement("tr");
                    row.className = "hover:bg-gray-50";
                    row.innerHTML = `
                        <td class="px-4 py-3">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                                    <i class="fas ${categoryIcon}"></i>
                                </div>
                                <span class="font-medium text-gray-800">${expense.title}</span>
                            </div>
                        </td>
                        <td class="px-4 py-3 font-medium">${formatCurrency(expense.amount)}</td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-1 text-xs rounded-full bg-primary-50 text-primary-700">${expense.category}</span>
                        </td>
                        <td class="px-4 py-3 text-gray-600">${formatDate(expense.date || expense.createdAt)}</td>
                        <td class="px-4 py-3 text-center">
                            <button onclick="deleteExpense('${expense._id}')" class="text-gray-500 hover:text-red-600 transition">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    expenseTable.appendChild(row);
                });
                
                calculateStats(data);
                toggleEmptyState(data);
            })
            .catch(error => {
                console.error("Error fetching expenses:", error);
                expenseTable.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-600">Failed to load expenses</td></tr>`;
            });
    }

    // Handle adding a new expense
    expenseForm.addEventListener("submit", (event) => {
        event.preventDefault();
       
        const newExpense = {
            title: document.getElementById("expenseTitle").value,
            amount: parseFloat(document.getElementById("expenseAmount").value),
            category: document.getElementById("expenseCategory").value,
            date: document.getElementById("expenseDate").value
        };
        
        // Display loading state
        const submitBtn = expenseForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Adding...';
        submitBtn.disabled = true;
        
        fetch("http://localhost:5000/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExpense)
        })
        .then(response => response.json())
        .then(() => {
            // Show success animation
            submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Added!';
            submitBtn.classList.remove("bg-primary-600", "hover:bg-primary-700");
            submitBtn.classList.add("bg-green-600", "hover:bg-green-700");
            
            // Reset form
            setTimeout(() => {
                expenseForm.reset();
                document.getElementById("expenseDate").valueAsDate = new Date();
                submitBtn.innerHTML = originalText;
                submitBtn.classList.add("bg-primary-600", "hover:bg-primary-700");
                submitBtn.classList.remove("bg-green-600", "hover:bg-green-700");
                submitBtn.disabled = false;
            }, 1000);
            
            loadExpenses();
        })
        .catch(error => {
            console.error("Error adding expense:", error);
            submitBtn.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i> Error!';
            submitBtn.classList.remove("bg-primary-600", "hover:bg-primary-700");
            submitBtn.classList.add("bg-red-600", "hover:bg-red-700");
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.classList.add("bg-primary-600", "hover:bg-primary-700");
                submitBtn.classList.remove("bg-red-600", "hover:bg-red-700");
                submitBtn.disabled = false;
            }, 1500);
        });
    });

    // Handle deleting an expense
    window.deleteExpense = function (id) {
        if (confirm("Are you sure you want to delete this expense?")) {
            fetch(`http://localhost:5000/expenses/${id}`, { method: "DELETE" })
            .then(() => {
                loadExpenses();
                // Show toast notification
                showToast("Expense deleted successfully");
            })
            .catch(error => {
                console.error("Error deleting expense:", error);
                showToast("Error deleting expense", true);
            });
        }
    };

    // Handle clear all expenses
    clearAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all expenses? This cannot be undone.")) {
            fetch("http://localhost:5000/expenses", { method: "DELETE" })
            .then(() => {
                loadExpenses();
                showToast("All expenses cleared");
            })
            .catch(error => {
                console.error("Error clearing expenses:", error);
                showToast("Error clearing expenses", true);
            });
        }
    });

    // Create a toast notification function
    function showToast(message, isError = false) {
        // Create toast element
        const toast = document.createElement("div");
        toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transition transform duration-300 translate-y-20 ${isError ? 'bg-red-600' : 'bg-green-600'} text-white flex items-center`;
        toast.innerHTML = `
            <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.remove("translate-y-20");
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add("translate-y-20");
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Load expenses on page load
    loadExpenses();
});