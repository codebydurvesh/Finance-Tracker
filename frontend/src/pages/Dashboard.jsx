import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Finance Tracker Dashboard</h1>
        <p>Dashboard implementation will be completed in Task 10</p>
      </header>
      <div className="dashboard-content">
        <div className="info-box">
          <h2>✅ Backend Complete</h2>
          <ul>
            <li>User Authentication</li>
            <li>Transaction CRUD API</li>
            <li>Budget Management</li>
            <li>18 Passing Tests</li>
          </ul>
        </div>
        <div className="info-box">
          <h2>🚀 Frontend Setup Complete</h2>
          <ul>
            <li>React Router</li>
            <li>Axios API Service</li>
            <li>Auth Context</li>
            <li>Recharts Ready</li>
          </ul>
        </div>
        <div className="info-box">
          <h2>📋 Next Steps</h2>
          <ul>
            <li>Task 9: Auth UI (Login/Register)</li>
            <li>Task 10: Dashboard Layout</li>
            <li>Task 11: Transaction List</li>
            <li>Task 12: Pie Chart Analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
