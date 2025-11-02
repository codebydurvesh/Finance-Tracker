import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ userName, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <h1>💰 Finance Tracker</h1>
          <p>Welcome, {userName}!</p>
        </div>
        <div className="header-right">
          <button
            onClick={() => navigate("/settings")}
            className="settings-btn"
          >
            ⚙️ Settings
          </button>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
