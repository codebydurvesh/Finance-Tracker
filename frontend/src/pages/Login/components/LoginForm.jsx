import React, { useState } from "react";
import { isValidEmail } from "../../../utils/helpers";

const LoginForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "email") {
      if (value && !isValidEmail(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return { success: false, message: "Please fill in all fields" };
    }

    if (!isValidEmail(formData.email)) {
      setEmailError("Invalid email format");
      return { success: false, message: "Please enter a valid email address" };
    }

    return await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={loading}
          className={emailError ? "input-error" : ""}
        />
        {emailError && <span className="field-error">✗ {emailError}</span>}
        {formData.email && !emailError && (
          <span className="field-success">✓ Valid email</span>
        )}
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
            placeholder="Enter your password"
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

      <button type="submit" className="auth-button" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
