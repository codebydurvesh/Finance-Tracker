import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  register as registerService,
  sendOTP,
  verifyOTP,
} from "../../services/authService";
import EmailVerification from "./components/EmailVerification";
import OTPVerification from "./components/OTPVerification";
import RegisterForm from "./components/RegisterForm";
import Footer from "../../components/Footer/Footer";
import "./Register.css";

const Register = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Registration
  const [email, setEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (emailAddress) => {
    setError("");
    setLoading(true);

    try {
      await sendOTP(emailAddress);
      setEmail(emailAddress);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (emailAddress, otp) => {
    setError("");
    setLoading(true);

    try {
      const response = await verifyOTP(emailAddress, otp);
      setVerificationToken(response.verificationToken);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setError("");
    setLoading(true);

    try {
      const { name, password } = formData;
      const response = await registerService({
        name,
        email,
        password,
        verificationToken,
      });
      login(response.user, response.token);
      navigate("/dashboard");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EmailVerification onSendOTP={handleSendOTP} loading={loading} />
        );
      case 2:
        return (
          <OTPVerification
            email={email}
            onVerifyOTP={handleVerifyOTP}
            onResendOTP={handleSendOTP}
            loading={loading}
          />
        );
      case 3:
        return (
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            verifiedEmail={email}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>💰 Finance Tracker</h1>
          <p>Create your account</p>
          {step > 1 && (
            <div className="progress-steps">
              <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {renderStep()}

        <div className="auth-footer">
          <Link to="/login" className="auth-link">
            Already have an account? <strong>Login</strong>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
