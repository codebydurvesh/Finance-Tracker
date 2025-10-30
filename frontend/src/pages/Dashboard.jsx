import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getTransactions,
  getTransactionSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";
import { updateBudget, getUserProfile } from "../services/userService";
import { formatCurrency } from "../utils/helpers";
import TransactionsList from "../components/TransactionsList";
import PieChartAnalytics from "../components/PieChartAnalytics";
import BudgetAlert from "../components/BudgetAlert";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const pieChartRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget || 0);
  const [budgetInput, setBudgetInput] = useState("");
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const [transactionForm, setTransactionForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Other",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsData, summaryData, userProfile] = await Promise.all([
        getTransactions(),
        getTransactionSummary(),
        getUserProfile(),
      ]);
      setTransactions(transactionsData);
      setSummary(summaryData);

      // Update monthly budget from server
      if (userProfile && userProfile.monthlyBudget !== undefined) {
        setMonthlyBudget(userProfile.monthlyBudget);
        updateUser(userProfile);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBudgetUpdate = async () => {
    if (!budgetInput || isNaN(budgetInput) || Number(budgetInput) < 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    try {
      const updatedUser = await updateBudget(Number(budgetInput));
      setMonthlyBudget(updatedUser.monthlyBudget);
      updateUser(updatedUser);
      setIsEditingBudget(false);
      setSuccess("Budget updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update budget");
      console.error(err);
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!transactionForm.title || !transactionForm.amount) {
      setError("Please fill in all required fields");
      return;
    }

    if (Number(transactionForm.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const newTransaction = await createTransaction({
        ...transactionForm,
        amount: Number(transactionForm.amount),
      });

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

      // Reset form
      setTransactionForm({
        title: "",
        amount: "",
        type: "expense",
        category: "Other",
        date: new Date().toISOString().split("T")[0],
      });

      setSuccess("Transaction added successfully!");
      setTimeout(() => setSuccess(""), 3000);

      // Scroll to pie chart
      setTimeout(() => {
        pieChartRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setTransactionForm({
      ...transactionForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateTransaction = async (id, updatedData) => {
    try {
      const updatedTransaction = await updateTransaction(id, updatedData);

      // Update transactions list
      setTransactions(
        transactions.map((t) => (t._id === id ? updatedTransaction : t))
      );

      // Recalculate summary
      await fetchSummary();

      setSuccess("Transaction updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update transaction");
      throw err;
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);

      // Remove from transactions list
      setTransactions(transactions.filter((t) => t._id !== id));

      // Recalculate summary
      await fetchSummary();

      setSuccess("Transaction deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete transaction");
      throw err;
    }
  };

  const fetchSummary = async () => {
    try {
      const summaryData = await getTransactionSummary();
      setSummary(summaryData);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
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
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Messages */}
      {error && <div className="message error-message">{error}</div>}
      {success && <div className="message success-message">{success}</div>}

      {/* Budget Section */}
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

      {/* Budget Alert */}
      <BudgetAlert
        totalIncome={summary.totalIncome + monthlyBudget}
        totalExpense={summary.totalExpense}
        monthlyBudget={monthlyBudget}
      />

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
              : summary.totalExpense >= (summary.totalIncome + monthlyBudget) * 0.9
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
        <form onSubmit={handleTransactionSubmit} className="transaction-form">
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
                min="0.01"
                step="0.01"
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
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={transactionForm.category}
                onChange={handleFormChange}
                placeholder="e.g., Food, Transport"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={transactionForm.date}
                onChange={handleFormChange}
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

      {/* Transactions Preview */}
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
                  <span className="transaction-title">{transaction.title}</span>
                  <span className="transaction-category">
                    {transaction.category}
                  </span>
                </div>
                <span className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default Dashboard;
