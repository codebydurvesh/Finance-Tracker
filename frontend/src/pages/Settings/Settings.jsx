import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile, changePassword } from "../../services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SettingsHeader from "./components/SettingsHeader";
import ProfileForm from "./components/ProfileForm";
import PasswordForm from "./components/PasswordForm";
import GoogleInfo from "./components/GoogleInfo";
import "./Settings.css";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [error, setError] = useState("");

  const isGoogleUser = user?.googleId;

  const handleProfileUpdate = async (profileData) => {
    setError("");
    try {
      const response = await updateUserProfile({
        name: profileData.name,
        email: profileData.email,
      });

      updateUser(response.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to update profile. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const handlePasswordChange = async (passwordData) => {
    setError("");
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to change password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <div className="settings-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="settings-content">
        <SettingsHeader />

        {error && <div className="error-message">{error}</div>}

        <ProfileForm
          user={user}
          onSubmit={handleProfileUpdate}
          isGoogleUser={isGoogleUser}
        />

        {!isGoogleUser ? (
          <PasswordForm onSubmit={handlePasswordChange} />
        ) : (
          <GoogleInfo />
        )}
      </div>
    </div>
  );
};

export default Settings;
