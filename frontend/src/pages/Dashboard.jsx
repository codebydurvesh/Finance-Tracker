import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import {
  getTransactions,
  getTransactionsByMonth,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";
import { updateBudget, getUserProfile } from "../services/userService";
import { formatCurrency } from "../utils/helpers";
import TransactionsList from "../components/TransactionsList";
import PieChartAnalytics from "../components/PieChartAnalytics";
import BudgetAlert from "../components/BudgetAlert";
import MonthNavigation from "../components/MonthNavigation";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const pieChartRef = useRef(null);
  const alertRef = useRef(null);

  // Predefined categories
  const EXPENSE_CATEGORIES = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Groceries",
    "Rent/Mortgage",
    "Other",
    "Custom",
  ];

  const INCOME_CATEGORIES = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Bonus",
    "Other",
    "Custom",
  ];

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget || 0);
  const [budgetInput, setBudgetInput] = useState("");
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  // Month selection state (default to current month)
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  ); // 1-12

  const [transactionForm, setTransactionForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "", // Empty by default - user must select
    day: new Date().getDate(), // Just store the day
  });
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]); // Refetch when month changes

  // Update form day when month changes to default to current day or 1st
  useEffect(() => {
    const today = new Date();
    const isCurrentMonth =
      selectedYear === today.getFullYear() &&
      selectedMonth === today.getMonth() + 1;

    // If viewing current month, default to today's day, otherwise 1st day
    const defaultDay = isCurrentMonth ? today.getDate() : 1;

    setTransactionForm((prev) => ({
      ...prev,
      day: defaultDay,
    }));
  }, [selectedYear, selectedMonth]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [transactionsData, userProfile] = await Promise.all([
        getTransactionsByMonth(selectedYear, selectedMonth),
        getUserProfile(),
      ]);

      // Sort transactions by createdAt timestamp (newest first) to show most recent transactions on top
      const sortedTransactions = transactionsData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setTransactions(sortedTransactions);

      // Calculate summary based on the selected month's transactions
      const monthSummary = sortedTransactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "income") {
            acc.totalIncome += transaction.amount;
            acc.netBalance += transaction.amount;
          } else {
            acc.totalExpense += transaction.amount;
            acc.netBalance -= transaction.amount;
          }
          return acc;
        },
        { totalIncome: 0, totalExpense: 0, netBalance: 0 }
      );

      setSummary(monthSummary);

      // Update monthly budget from server
      if (userProfile && userProfile.monthlyBudget !== undefined) {
        setMonthlyBudget(userProfile.monthlyBudget);
        updateUser(userProfile);
      }
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper function to get month name
  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month - 1];
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Don't allow navigating beyond current month
    if (selectedYear === currentYear && selectedMonth === currentMonth) {
      return;
    }

    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleBudgetUpdate = async () => {
    if (!budgetInput || isNaN(budgetInput) || Number(budgetInput) < 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    try {
      const updatedUser = await updateBudget(Number(budgetInput));
      setMonthlyBudget(updatedUser.monthlyBudget);
      updateUser(updatedUser);
      setIsEditingBudget(false);
      toast.success("Budget updated successfully!");
    } catch (err) {
      toast.error("Failed to update budget");
      console.error(err);
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    if (
      !transactionForm.title ||
      !transactionForm.amount ||
      !transactionForm.day ||
      !transactionForm.category
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = Number(transactionForm.amount);
    const day = Number(transactionForm.day);

    // Enhanced validation
    if (isNaN(amount)) {
      toast.error("Please enter a valid number for amount");
      return;
    }

    if (!Number.isInteger(amount)) {
      toast.error("Amount must be a whole number (no decimals)");
      return;
    }

    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (amount > 1000000000) {
      toast.error("Amount is too large. Please enter a reasonable value");
      return;
    }

    if (transactionForm.title.trim().length < 2) {
      toast.error("Title must be at least 2 characters long");
      return;
    }

    if (transactionForm.title.length > 100) {
      toast.error("Title is too long. Please keep it under 100 characters");
      return;
    }

    // Validate day
    if (isNaN(day) || day < 1 || day > 31) {
      toast.error("Please enter a valid day (1-31)");
      return;
    }

    // Check if day is valid for the selected month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    if (day > daysInMonth) {
      toast.error(
        `${getMonthName(
          selectedMonth
        )} ${selectedYear} only has ${daysInMonth} days`
      );
      return;
    }

    // Construct the date string directly to avoid timezone issues
    // Format: YYYY-MM-DD
    const paddedMonth = String(selectedMonth).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");
    const dateString = `${selectedYear}-${paddedMonth}-${paddedDay}`;

    setLoading(true);

    try {
      const newTransaction = await createTransaction({
        title: transactionForm.title,
        amount: amount,
        type: transactionForm.type,
        category: transactionForm.category,
        date: dateString,
      });

      // Check if the new transaction belongs to the currently selected month
      const transactionDate = new Date(newTransaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;

      // Only update local state if transaction is in the selected month
      if (
        transactionYear === selectedYear &&
        transactionMonth === selectedMonth
      ) {
        setTransactions([newTransaction, ...transactions]);

        // Update summary
        if (transactionForm.type === "income") {
          setSummary({
            ...summary,
            totalIncome: summary.totalIncome + newTransaction.amount,
            netBalance: summary.netBalance + newTransaction.amount,
          });
        } else {
          setSummary({
            ...summary,
            totalExpense: summary.totalExpense + newTransaction.amount,
            netBalance: summary.netBalance - newTransaction.amount,
          });
        }
      }

      // Reset form (use today's day if current month, otherwise first day of selected month)
      const today = new Date();
      const isCurrentMonth =
        selectedYear === today.getFullYear() &&
        selectedMonth === today.getMonth() + 1;
      const defaultDay = isCurrentMonth ? today.getDate() : 1;

      setTransactionForm({
        title: "",
        amount: "",
        type: "expense",
        category: "", // Reset to empty - user must select
        day: defaultDay,
      });
      setCustomCategory("");
      setShowCustomCategory(false);

      toast.success("Transaction added successfully!");

      // Only scroll to pie chart if transaction is in current month view
      if (
        transactionYear === selectedYear &&
        transactionMonth === selectedMonth
      ) {
        // Calculate if budget is exceeded after this transaction
        const updatedTotalIncome =
          summary.totalIncome +
          monthlyBudget +
          (transactionForm.type === "income" ? newTransaction.amount : 0);
        const updatedTotalExpense =
          summary.totalExpense +
          (transactionForm.type === "expense" ? newTransaction.amount : 0);
        const isBudgetExceeded = updatedTotalExpense > updatedTotalIncome;

        // Scroll to top if budget exceeded, otherwise scroll to pie chart
        setTimeout(() => {
          if (isBudgetExceeded) {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          } else if (pieChartRef.current) {
            pieChartRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Handle category selection
    if (name === "category") {
      if (value === "Custom") {
        setShowCustomCategory(true);
        setTransactionForm({
          ...transactionForm,
          category: customCategory || "",
        });
      } else {
        setShowCustomCategory(false);
        setTransactionForm({
          ...transactionForm,
          category: value,
        });
      }
    }
    // Handle type change - reset category to empty for that type
    else if (name === "type") {
      setShowCustomCategory(false);
      setTransactionForm({
        ...transactionForm,
        type: value,
        category: "", // Reset to empty when type changes
      });
    } else {
      setTransactionForm({
        ...transactionForm,
        [name]: value,
      });
    }
  };

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    setCustomCategory(value);
    setTransactionForm({
      ...transactionForm,
      category: value,
    });
  };

  const handleUpdateTransaction = async (id, updatedData) => {
    try {
      const updatedTransaction = await updateTransaction(id, updatedData);

      // Check if updated transaction still belongs to the selected month
      const transactionDate = new Date(updatedTransaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;

      if (
        transactionYear === selectedYear &&
        transactionMonth === selectedMonth
      ) {
        // Update transactions list and re-sort by createdAt (newest first)
        const updatedList = transactions.map((t) =>
          t._id === id ? updatedTransaction : t
        );
        const sortedList = updatedList.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setTransactions(sortedList);

        // Recalculate summary from updated transactions
        const monthSummary = sortedList.reduce(
          (acc, transaction) => {
            if (transaction.type === "income") {
              acc.totalIncome += transaction.amount;
              acc.netBalance += transaction.amount;
            } else {
              acc.totalExpense += transaction.amount;
              acc.netBalance -= transaction.amount;
            }
            return acc;
          },
          { totalIncome: 0, totalExpense: 0, netBalance: 0 }
        );
        setSummary(monthSummary);
      } else {
        // Transaction moved to different month, remove from current view
        setTransactions(transactions.filter((t) => t._id !== id));

        // Recalculate summary without this transaction
        const filteredList = transactions.filter((t) => t._id !== id);
        const monthSummary = filteredList.reduce(
          (acc, transaction) => {
            if (transaction.type === "income") {
              acc.totalIncome += transaction.amount;
              acc.netBalance += transaction.amount;
            } else {
              acc.totalExpense += transaction.amount;
              acc.netBalance -= transaction.amount;
            }
            return acc;
          },
          { totalIncome: 0, totalExpense: 0, netBalance: 0 }
        );
        setSummary(monthSummary);
      }

      toast.success("Transaction updated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update transaction"
      );
      throw err;
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);

      // Remove from transactions list
      const filteredList = transactions.filter((t) => t._id !== id);
      setTransactions(filteredList);

      // Recalculate summary from remaining transactions
      const monthSummary = filteredList.reduce(
        (acc, transaction) => {
          if (transaction.type === "income") {
            acc.totalIncome += transaction.amount;
            acc.netBalance += transaction.amount;
          } else {
            acc.totalExpense += transaction.amount;
            acc.netBalance -= transaction.amount;
          }
          return acc;
        },
        { totalIncome: 0, totalExpense: 0, netBalance: 0 }
      );
      setSummary(monthSummary);

      toast.success("Transaction deleted successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete transaction"
      );
      throw err;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>💰 Finance Tracker</h1>
            <p>Welcome, {user?.name}!</p>
          </div>
          <div className="header-right">
            <button
              onClick={() => navigate("/settings")}
              className="settings-btn"
            >
              ⚙️ Settings
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {dataLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your data...</p>
        </div>
      ) : (
        <>
          <div className="budget-section">
            <h3>Monthly Budget</h3>
            {!isEditingBudget ? (
              <div className="budget-display">
                <span className="budget-amount">
                  {formatCurrency(monthlyBudget)}
                </span>
                <button
                  onClick={() => {
                    setBudgetInput(monthlyBudget);
                    setIsEditingBudget(true);
                  }}
                  className="edit-btn"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="budget-edit">
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Enter monthly budget"
                  min="0"
                />
                <button onClick={handleBudgetUpdate} className="save-btn">
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBudget(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Month Navigation */}
          <MonthNavigation
            year={selectedYear}
            month={selectedMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          {/* Budget Alert */}
          <div ref={alertRef}>
            <BudgetAlert
              totalIncome={summary.totalIncome + monthlyBudget}
              totalExpense={summary.totalExpense}
              monthlyBudget={monthlyBudget}
            />
          </div>

          {/* Summary Cards */}
          <div className="summary-section">
            <div className="summary-card income">
              <h3>Total Income</h3>
              <p className="amount">
                {formatCurrency(summary.totalIncome + monthlyBudget)}
              </p>
            </div>
            <div
              className={`summary-card expense ${
                summary.totalExpense > summary.totalIncome + monthlyBudget
                  ? "danger"
                  : summary.totalExpense >=
                    (summary.totalIncome + monthlyBudget) * 0.9
                  ? "warning"
                  : ""
              }`}
            >
              <h3>Total Expense</h3>
              <p className="amount">{formatCurrency(summary.totalExpense)}</p>
            </div>
            <div
              className={`summary-card balance ${
                summary.totalIncome + monthlyBudget - summary.totalExpense < 0
                  ? "danger"
                  : ""
              }`}
            >
              <h3>Net Balance</h3>
              <p className="amount">
                {formatCurrency(
                  summary.totalIncome + monthlyBudget - summary.totalExpense
                )}
              </p>
            </div>
          </div>

          {/* Add Transaction Form */}
          <div className="transaction-form-section">
            <h3>Add Transaction</h3>
            <form
              onSubmit={handleTransactionSubmit}
              className="transaction-form"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={transactionForm.title}
                    onChange={handleFormChange}
                    placeholder="e.g., Salary, Grocery"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={transactionForm.amount}
                    onChange={handleFormChange}
                    placeholder="0"
                    min="1"
                    step="1"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={transactionForm.type}
                    onChange={handleFormChange}
                    disabled={loading}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="category">
                    Category *
                    <span className="field-hint">
                      {" "}
                      (Helps organize your {transactionForm.type}s)
                    </span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={
                      showCustomCategory ? "Custom" : transactionForm.category
                    }
                    onChange={handleFormChange}
                    disabled={loading}
                    required
                  >
                    <option value="" disabled>
                      -- Select a category --
                    </option>
                    {(transactionForm.type === "expense"
                      ? EXPENSE_CATEGORIES
                      : INCOME_CATEGORIES
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Category Input */}
              {showCustomCategory && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="customCategory">
                      Custom Category Name *
                    </label>
                    <input
                      type="text"
                      id="customCategory"
                      value={customCategory}
                      onChange={handleCustomCategoryChange}
                      placeholder="Enter your custom category"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="day">
                    Date * ({getMonthName(selectedMonth)} {selectedYear})
                  </label>
                  <input
                    type="number"
                    id="day"
                    name="day"
                    value={transactionForm.day}
                    onChange={handleFormChange}
                    placeholder="Day (1-31)"
                    min="1"
                    max={new Date(selectedYear, selectedMonth, 0).getDate()}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="add-btn" disabled={loading}>
                    {loading ? "Adding..." : "Add Transaction"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Transactions Preview - Only show for current month */}
          {selectedYear === currentDate.getFullYear() &&
            selectedMonth === currentDate.getMonth() + 1 && (
              <div className="transactions-preview">
                <h3>Recent Transactions</h3>
                {transactions.length === 0 ? (
                  <p className="no-data">
                    No transactions yet. Add your first transaction above!
                  </p>
                ) : (
                  <div className="transactions-list">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction._id} className="transaction-item">
                        <div className="transaction-info">
                          <span className="transaction-title">
                            {transaction.title}
                          </span>
                          <span className="transaction-category">
                            {transaction.category}
                          </span>
                        </div>
                        <span
                          className={`transaction-amount ${transaction.type}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Pie Chart Analytics */}
          <div ref={pieChartRef}>
            <PieChartAnalytics
              transactions={transactions}
              monthlyBudget={monthlyBudget}
            />
          </div>

          {/* Full Transactions List with Edit/Delete */}
          <TransactionsList
            transactions={transactions}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
