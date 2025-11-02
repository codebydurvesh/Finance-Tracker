import React, { useState, useEffect } from "react";
import OTPInput from "../../Register/components/OTPInput";
import {
  sendEmailChangeOTP,
  verifyEmailChangeOTP,
} from "../../../services/userService";
import { toast } from "react-toastify";

const EmailChangeModal = ({ currentEmail, onClose, onEmailUpdated }) => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Verify OTP
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!newEmail.trim()) {
      setError("Please enter an email address");
      return;
    }

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError("This is already your current email address");
      return;
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(newEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await sendEmailChangeOTP(newEmail);
      toast.success("OTP sent to your new email address!");
      setStep(2);
      setTimeLeft(600); // 10 minutes
      setCanResend(false);
      setResendCooldown(60); // 1 minute cooldown
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyEmailChangeOTP(newEmail, otp);
      toast.success("Email updated successfully!");
      onEmailUpdated(response.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setError("");
    setLoading(true);

    try {
      await sendEmailChangeOTP(newEmail);
      toast.success("New OTP sent to your email!");
      setOtp("");
      setTimeLeft(600);
      setCanResend(false);
      setResendCooldown(60);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {step === 1 ? (
          <div className="email-change-step">
            <div className="step-header">
              <div className="step-icon">📧</div>
              <h2>Change Email Address</h2>
              <p>Enter your new email address to receive a verification code</p>
            </div>

            <div className="current-email-info">
              <strong>Current Email:</strong> {currentEmail}
            </div>

            <form onSubmit={handleSendOTP}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="newEmail">New Email Address</label>
                <input
                  type="email"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="modal-submit-btn"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send Verification Code"}
              </button>
            </form>
          </div>
        ) : (
          <div className="email-change-step">
            <div className="step-header">
              <div className="step-icon">🔐</div>
              <h2>Verify Your Email</h2>
              <p>
                We've sent a 6-digit code to <strong>{newEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP}>
              {error && <div className="error-message">{error}</div>}

              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                disabled={loading || timeLeft === 0}
              />

              <div className="otp-info">
                {timeLeft > 0 ? (
                  <p className="time-left">
                    Time remaining: {formatTime(timeLeft)}
                  </p>
                ) : (
                  <p className="time-expired">
                    OTP expired. Please request a new one.
                  </p>
                )}
              </div>

              <div className="resend-section">
                <span>Didn't receive the code? </span>
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendOTP}
                  disabled={!canResend || loading}
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>

              <button
                type="submit"
                className="modal-submit-btn"
                disabled={loading || otp.length !== 6 || timeLeft === 0}
              >
                {loading ? "Verifying..." : "Verify & Update Email"}
              </button>

              <button
                type="button"
                className="modal-back-btn"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                }}
                disabled={loading}
              >
                ← Back to Email Entry
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailChangeModal;
