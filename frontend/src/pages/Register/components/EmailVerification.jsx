import React, { useState } from "react";
import { isValidEmail } from "../../../utils/helpers";

const EmailVerification = ({ onSendOTP, loading }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !isValidEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    await onSendOTP(email);
  };

  return (
    <div className="email-verification-step">
      <div className="step-header">
        <div className="step-icon">✉️</div>
        <h2>Verify Your Email</h2>
        <p>We'll send you a verification code to confirm your email address</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email address"
            disabled={loading}
            className={emailError ? "input-error" : ""}
            autoFocus
          />
          {emailError && <span className="field-error">✗ {emailError}</span>}
          {email && !emailError && (
            <span className="field-success">✓ Valid email</span>
          )}
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading || emailError}
        >
          {loading ? "Sending code..." : "Send Verification Code"}
        </button>
      </form>

      <div className="step-footer">
        <p className="info-text">
          <strong>Why verify?</strong> This ensures you own the email address
          and helps us keep your account secure.
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
