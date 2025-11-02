import React, { useState } from "react";
import { changeEmail } from "../../../services/userService";
import { toast } from "react-toastify";

const EmailChangeModal = ({ currentEmail, onClose, onEmailUpdated }) => {
  const [formData, setFormData] = useState({
    newEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.newEmail.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError("This is already your current email address");
      return;
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.newEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await changeEmail(formData.newEmail, formData.password);
      toast.success("Email updated successfully!");
      onEmailUpdated(response.user);
      onClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to update email. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="email-change-step">
          <div className="step-header">
            <div className="step-icon">📧</div>
            <h2>Change Email Address</h2>
            <p>Enter your new email address and confirm with your password</p>
          </div>

          <div className="current-email-info">
            <strong>Current Email:</strong> {currentEmail}
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="newEmail">New Email Address</label>
              <input
                type="email"
                id="newEmail"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleChange}
                placeholder="Enter new email address"
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={loading}
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

            <button
              type="submit"
              className="modal-submit-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailChangeModal;
