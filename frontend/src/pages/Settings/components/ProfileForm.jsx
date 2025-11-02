import React, { useState } from "react";
import { isValidEmail } from "../../../utils/helpers";
import EmailChangeModal from "./EmailChangeModal";

const ProfileForm = ({ user, onSubmit, isGoogleUser, onEmailUpdated }) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      return { success: false, message: "Name cannot be empty" };
    }

    // Only update name, not email (email changes through OTP modal)
    setProfileLoading(true);

    try {
      await onSubmit({
        name: profileData.name,
      });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      };
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEmailChange = () => {
    if (isGoogleUser) return;
    setShowEmailModal(true);
  };

  const handleEmailUpdated = (updatedUser) => {
    setProfileData({
      ...profileData,
      email: updatedUser.email,
    });
    onEmailUpdated(updatedUser);
  };

  return (
    <div className="settings-section">
      <h2>Profile Information</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            placeholder="Enter your full name"
            disabled={profileLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="email-field-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              readOnly
              disabled
              placeholder="Enter your email"
            />
            {!isGoogleUser && (
              <button
                type="button"
                className="change-email-btn"
                onClick={handleEmailChange}
              >
                Change Email
              </button>
            )}
          </div>
          {isGoogleUser && (
            <span className="field-info">
              ℹ️ Email cannot be changed for Google accounts
            </span>
          )}
        </div>

        <button
          type="submit"
          className="settings-save-btn"
          disabled={profileLoading}
        >
          {profileLoading ? "Updating..." : "Save Profile"}
        </button>
      </form>

      {showEmailModal && (
        <EmailChangeModal
          currentEmail={user.email}
          onClose={() => setShowEmailModal(false)}
          onEmailUpdated={handleEmailUpdated}
        />
      )}
    </div>
  );
};

export default ProfileForm;
