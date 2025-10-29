import React from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>
        <p>Registration form will be implemented in Task 9</p>
        <Link to="/login" className="auth-link">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
