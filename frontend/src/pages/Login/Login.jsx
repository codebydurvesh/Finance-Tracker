import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/authService";
import { isValidEmail } from "../../utils/helpers";
import LoginForm from "./components/LoginForm";
import GoogleLoginButton from "./components/GoogleLoginButton";
import "./Login.css";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (formData) => {
    setError("");
    setLoading(true);

    try {
      const response = await loginService(formData);
      login(response.user, response.token);
      navigate("/dashboard");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server error. Please try again later.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed");
      }

      login(data.user, data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message || "Google login failed. Please try again.");
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

        <LoginForm onSubmit={handleLoginSubmit} loading={loading} />

        <div className="divider">
          <span>OR</span>
        </div>

        <GoogleLoginButton onGoogleLogin={handleGoogleLogin} />

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
