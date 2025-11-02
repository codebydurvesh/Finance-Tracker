import React, { useState, useEffect } from "react";
import OTPInput from "./OTPInput";

const OTPVerification = ({ email, onVerifyOTP, onResendOTP, loading }) => {
  const [otp, setOTP] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    // Countdown timer for OTP expiry
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
  }, []);

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const cooldownTimer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(cooldownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(cooldownTimer);
    }
  }, [resendCooldown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return;
    }

    await onVerifyOTP(email, otp);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendCooldown(60);
    setTimeLeft(600); // Reset to 10 minutes
    setOTP("");
    await onResendOTP(email);
  };

  return (
    <div className="otp-verification-step">
      <div className="step-header">
        <div className="step-icon">🔐</div>
        <h2>Enter Verification Code</h2>
        <p>
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Verification Code</label>
          <OTPInput
            length={6}
            value={otp}
            onChange={setOTP}
            disabled={loading || timeLeft === 0}
          />
          <div className="otp-info">
            {timeLeft > 0 ? (
              <span className="time-left">
                ⏱️ Code expires in {formatTime(timeLeft)}
              </span>
            ) : (
              <span className="time-expired">
                ⚠️ Code expired. Please request a new one.
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading || otp.length !== 6 || timeLeft === 0}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      <div className="step-footer">
        <p className="resend-section">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || loading}
            className="resend-btn"
          >
            {canResend ? "Resend Code" : `Resend in ${resendCooldown}s`}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
