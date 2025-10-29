import React, { useState } from "react";
import { formatCurrency, formatDate } from "../utils/helpers";
import "./TransactionsList.css";

const TransactionsList = ({ transactions, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category || "",
      date: new Date(transaction.date).toISOString().split("T")[0],
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      amount: "",
      type: "expense",
      category: "",
      date: "",
    });
  };

  const handleSaveEdit = async (transactionId) => {
    if (!editForm.title || !editForm.amount) {
      alert("Please fill in all required fields");
      return;
    }

    if (Number(editForm.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      await onUpdate(transactionId, {
        ...editForm,
        amount: Number(editForm.amount),
      });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (transactionId) => {
    setDeleteConfirm(transactionId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    setLoading(true);
    try {
      await onDelete(deleteConfirm);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="transactions-list-container">
        <h2>All Transactions</h2>
        <p className="no-data">
          No transactions yet. Add your first transaction above!
        </p>
      </div>
    );
  }

  return (
    <div className="transactions-list-container">
      <h2>All Transactions ({transactions.length})</h2>
      <div className="transactions-table">
        <div className="table-header">
          <div className="col-date">Date</div>
          <div className="col-title">Title</div>
          <div className="col-category">Category</div>
          <div className="col-type">Type</div>
          <div className="col-amount">Amount</div>
          <div className="col-actions">Actions</div>
        </div>

        {transactions.map((transaction) => (
          <div key={transaction._id} className="table-row">
            {editingId === transaction._id ? (
              // Edit Mode
              <>
                <div className="col-date">
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleFormChange}
                    disabled={loading}
                    className="edit-input"
                  />
                </div>
                <div className="col-title">
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleFormChange}
                    placeholder="Title"
                    disabled={loading}
                    className="edit-input"
                  />
                </div>
                <div className="col-category">
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleFormChange}
                    placeholder="Category"
                    disabled={loading}
                    className="edit-input"
                  />
                </div>
                <div className="col-type">
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleFormChange}
                    disabled={loading}
                    className="edit-input"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="col-amount">
                  <input
                    type="number"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleFormChange}
                    placeholder="Amount"
                    min="0.01"
                    step="0.01"
                    disabled={loading}
                    className="edit-input"
                  />
                </div>
                <div className="col-actions">
                  <button
                    onClick={() => handleSaveEdit(transaction._id)}
                    disabled={loading}
                    className="btn-save"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="btn-cancel"
                  >
                    ✖ Cancel
                  </button>
                </div>
              </>
            ) : (
              // View Mode
              <>
                <div className="col-date">{formatDate(transaction.date)}</div>
                <div className="col-title">{transaction.title}</div>
                <div className="col-category">
                  {transaction.category || "-"}
                </div>
                <div className="col-type">
                  <span className={`type-badge ${transaction.type}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className={`col-amount amount-${transaction.type}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
                <div className="col-actions">
                  <button
                    onClick={() => handleEditClick(transaction)}
                    className="btn-edit"
                    disabled={loading || deleteConfirm === transaction._id}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(transaction._id)}
                    className="btn-delete"
                    disabled={loading || deleteConfirm === transaction._id}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this transaction?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="btn-confirm-delete"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={handleCancelDelete}
                disabled={loading}
                className="btn-cancel-delete"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
