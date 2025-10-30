import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/authService";
import { isValidEmail } from "../utils/helpers";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  // Google login handler using useCallback to maintain reference
  const handleGoogleLogin = useCallback(
    async (credentialResponse) => {
      setLoading(true);
      setError("");

      try {
        // Send the Google credential to your backend
        const apiUrl =
          process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        console.log(
          "Sending Google login request to:",
          `${apiUrl}/auth/google`
        );

        const response = await fetch(`${apiUrl}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers.get("content-type"));

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error(
            "Server error: Backend returned HTML instead of JSON. Make sure backend server is running on port 5000."
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Google login failed");
        }

        login(data.user, data.token);
        navigate("/dashboard");
      } catch (err) {
        console.error("Google login error:", err);
        setError(err.message || "Google login failed. Please try again.");
        setLoading(false);
      }
    },
    [login, navigate]
  );

  // Load Google Sign-In script and initialize
  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    // Don't load Google Sign-In if Client ID is not configured
    if (
      !clientId ||
      clientId === "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com"
    ) {
      console.warn("Google Client ID not configured. Google Sign-In disabled.");
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML =
          '<p style="text-align: center; color: #999; font-size: 0.9rem;">Google Sign-In not configured</p>';
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Initialize Google Sign-In after script loads
      if (window.google && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleLogin,
            auto_select: false,
            cancel_on_tap_outside: true,
            itp_support: true,
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            width: 350,
            shape: "rectangular",
            logo_alignment: "left",
          });
        } catch (err) {
          console.error("Google Sign-In initialization error:", err);
          if (googleButtonRef.current) {
            googleButtonRef.current.innerHTML =
              '<p style="text-align: center; color: #f44336; font-size: 0.9rem;">Google Sign-In error. Check console for details.</p>';
          }
        }
      }
    };

    script.onerror = () => {
      console.error("Failed to load Google Sign-In script");
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML =
          '<p style="text-align: center; color: #f44336; font-size: 0.9rem;">Failed to load Google Sign-In</p>';
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleGoogleLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(""); // Clear error when user types

    // Real-time email validation
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
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      setEmailError("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      const response = await loginService(formData);
      login(response.user, response.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>💰 Finance Tracker</h1>
          <p>Login to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

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

        <div className="divider">
          <span>OR</span>
        </div>

        <div ref={googleButtonRef} className="google-signin-wrapper"></div>

        <div className="auth-footer">
          <Link to="/register" className="auth-link">
            Don't have an account? <strong>Register</strong>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
