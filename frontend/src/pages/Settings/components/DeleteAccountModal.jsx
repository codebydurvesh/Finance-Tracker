import React, { useState } from "react";
import { deleteAccount } from "../../../services/userService";
import { toast } from "react-toastify";

const DeleteAccountModal = ({ userEmail, onClose, onAccountDeleted }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Please enter your password to confirm");
      return;
    }

    setLoading(true);

    try {
      await deleteAccount(password);
      toast.success("Account deleted successfully");
      onAccountDeleted();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to delete account. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="delete-account-step">
          <div className="step-header danger-header">
            <div className="step-icon">⚠️</div>
            <h2 style={{ color: "#f44336" }}>Delete Account</h2>
            <p>This action cannot be undone</p>
          </div>

          <div className="danger-warning">
            <h3>⚠️ Warning: Permanent Action</h3>
            <p>
              You are about to <strong>permanently delete</strong> your Finance
              Tracker account. This will:
            </p>
            <ul>
              <li>❌ Delete all your financial data and transactions</li>
              <li>❌ Remove your budget settings and preferences</li>
              <li>❌ Permanently erase your profile information</li>
              <li>❌ Cannot be recovered or undone</li>
            </ul>
          </div>

          <div className="current-email-info">
            <strong>Account Email:</strong> {userEmail}
          </div>

          <form onSubmit={handleDelete}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="password">Confirm Your Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password to confirm"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <p className="confirmation-text">
              Enter your password to permanently delete your account and all
              associated data.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="modal-danger-btn"
                disabled={loading || !password.trim()}
              >
                {loading ? "Deleting Account..." : "Delete My Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
