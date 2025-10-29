import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Login form will be implemented in Task 9</p>
        <Link to="/register" className="auth-link">
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
