import React, { useState, useEffect } from "react";

const TransactionForm = ({
  onSubmit,
  loading,
  selectedYear,
  selectedMonth,
}) => {
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

  const currentDate = new Date();
  const [transactionForm, setTransactionForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    day: new Date().getDate(),
  });
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Update form day when month changes
  useEffect(() => {
    const today = new Date();
    const isCurrentMonth =
      selectedYear === today.getFullYear() &&
      selectedMonth === today.getMonth() + 1;

    const defaultDay = isCurrentMonth ? today.getDate() : 1;
    setTransactionForm((prev) => ({
      ...prev,
      day: defaultDay,
    }));
  }, [selectedYear, selectedMonth]);

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "category" && value === "Custom") {
      setShowCustomCategory(true);
      setCustomCategory("");
      setTransactionForm({
        ...transactionForm,
        category: "",
      });
    } else if (name === "category") {
      setShowCustomCategory(false);
      setCustomCategory("");
      setTransactionForm({
        ...transactionForm,
        category: value,
      });
    } else if (name === "type") {
      setShowCustomCategory(false);
      setTransactionForm({
        ...transactionForm,
        type: value,
        category: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(transactionForm);
    if (success) {
      // Reset form
      setTransactionForm({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        day: new Date().getDate(),
      });
      setCustomCategory("");
      setShowCustomCategory(false);
    }
  };

  return (
    <div className="transaction-form-section">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit} className="transaction-form">
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
              value={showCustomCategory ? "Custom" : transactionForm.category}
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

        {showCustomCategory && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customCategory">Custom Category Name *</label>
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
  );
};

export default TransactionForm;
