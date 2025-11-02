import React from "react";
import { useNavigate } from "react-router-dom";

const SettingsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-header">
      <h1>⚙️ Settings</h1>
      <p>Manage your account settings</p>
    </div>
  );
};

export default SettingsHeader;
