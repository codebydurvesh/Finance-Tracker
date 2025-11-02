import React, { useState, useEffect } from "react";
import OTPInput from "../../Register/components/OTPInput";
import {
  sendAccountDeletionOTP,
  verifyAndDeleteAccount,
} from "../../../services/userService";
import { toast } from "react-toastify";

const DeleteAccountModal = ({ userEmail, onClose, onAccountDeleted }) => {
  const [step, setStep] = useState(1); // 1: Confirm deletion, 2: Verify OTP
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

  const handleSendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      await sendAccountDeletionOTP();
      toast.success("Verification code sent to your email!");
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

  const handleVerifyAndDelete = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      await verifyAndDeleteAccount(otp);
      toast.success("Account deleted successfully");
      onAccountDeleted();
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
      await sendAccountDeletionOTP();
      toast.success("New verification code sent to your email!");
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
      <div
        className="modal-content delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {step === 1 ? (
          <div className="delete-account-step">
            <div className="step-header danger-header">
              <div className="step-icon">⚠️</div>
              <h2 style={{ color: "#f44336" }}>Delete Account</h2>
              <p>This action cannot be undone</p>
            </div>

            <div className="danger-warning">
              <h3>⚠️ Warning: Permanent Action</h3>
              <p>
                You are about to <strong>permanently delete</strong> your
                Finance Tracker account. This will:
              </p>
              <ul>
                <li>❌ Delete all your financial data and transactions</li>
                <li>❌ Remove your budget settings and preferences</li>
                <li>❌ Permanently erase your profile information</li>
                <li>❌ Cannot be recovered or undone</li>
              </ul>
            </div>

            <div className="current-email-info">
              <strong>Account Email:</strong> {userEmail}
            </div>

            {error && <div className="error-message">{error}</div>}

            <p className="confirmation-text">
              To confirm account deletion, we will send a verification code to
              your email address.
            </p>

            <div className="modal-actions">
              <button
                className="modal-cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="modal-danger-btn"
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? "Sending Code..." : "Send Verification Code"}
              </button>
            </div>
          </div>
        ) : (
          <div className="delete-account-step">
            <div className="step-header danger-header">
              <div className="step-icon">🔐</div>
              <h2 style={{ color: "#f44336" }}>Verify Account Deletion</h2>
              <p>
                We've sent a 6-digit code to <strong>{userEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyAndDelete}>
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

              <div className="danger-warning" style={{ marginTop: "20px" }}>
                <strong>⚠️ Final Warning:</strong>
                <p style={{ margin: "5px 0 0 0" }}>
                  Clicking "Delete My Account" will immediately and permanently
                  delete all your data. This cannot be undone.
                </p>
              </div>

              <button
                type="submit"
                className="modal-danger-btn"
                disabled={loading || otp.length !== 6 || timeLeft === 0}
                style={{ marginTop: "20px" }}
              >
                {loading ? "Deleting Account..." : "Delete My Account"}
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
                ← Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountModal;
