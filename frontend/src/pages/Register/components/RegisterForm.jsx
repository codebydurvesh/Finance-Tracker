import React, { useState } from "react";
import { isValidPassword, isValidEmail } from "../../../utils/helpers";

const RegisterForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return { success: false, message: "Please fill in all fields" };
    }

    if (formData.name.trim().length < 2) {
      return {
        success: false,
        message: "Name must be at least 2 characters long",
      };
    }

    if (!isValidEmail(formData.email)) {
      return { success: false, message: "Please enter a valid email address" };
    }

    if (!isValidPassword(formData.password)) {
      return {
        success: false,
        message: "Password must be at least 6 characters long",
      };
    }

    if (formData.password !== formData.confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    return await onSubmit(formData);
  };

  return (
    <div className="register-form-step">
      <div className="step-header">
        <div className="step-icon">📝</div>
        <h2>Complete Your Registration</h2>
        <p className="step-description">Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              disabled={loading}
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

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
