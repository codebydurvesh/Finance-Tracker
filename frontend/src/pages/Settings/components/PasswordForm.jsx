import React, { useState } from "react";

const PasswordForm = ({ onSubmit }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      return { success: false, message: "Please enter your current password" };
    }

    if (!passwordData.newPassword) {
      return { success: false, message: "Please enter a new password" };
    }

    if (passwordData.newPassword.length < 6) {
      return {
        success: false,
        message: "New password must be at least 6 characters",
      };
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return { success: false, message: "New passwords do not match" };
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      return {
        success: false,
        message: "New password must be different from current password",
      };
    }

    setPasswordLoading(true);

    try {
      await onSubmit({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to change password. Please try again.",
      };
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="settings-section">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <div className="password-input-wrapper">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              disabled={passwordLoading}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              tabIndex={-1}
            >
              {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="At least 6 characters"
              disabled={passwordLoading}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowNewPassword(!showNewPassword)}
              tabIndex={-1}
            >
              {showNewPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
              disabled={passwordLoading}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="settings-save-btn"
          disabled={passwordLoading}
        >
          {passwordLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;
