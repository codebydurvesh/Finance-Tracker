import React, { useState } from "react";
import { isValidEmail } from "../../../utils/helpers";

const ProfileForm = ({ user, onSubmit, isGoogleUser }) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

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

    if (!profileData.email.trim()) {
      return { success: false, message: "Email cannot be empty" };
    }

    if (!isValidEmail(profileData.email)) {
      return { success: false, message: "Please enter a valid email address" };
    }

    setProfileLoading(true);

    try {
      await onSubmit({
        name: profileData.name,
        email: profileData.email,
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
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            placeholder="Enter your email"
            disabled={profileLoading || isGoogleUser}
          />
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
    </div>
  );
};

export default ProfileForm;
