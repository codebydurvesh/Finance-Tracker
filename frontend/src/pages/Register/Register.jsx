import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { register as registerService } from "../../services/authService";
import RegisterForm from "./components/RegisterForm";
import "./Register.css";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (formData) => {
    setError("");
    setLoading(true);

    try {
      const { name, email, password } = formData;
      const response = await registerService({ name, email, password });
      login(response.user, response.token);
      navigate("/dashboard");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>💰 Finance Tracker</h1>
          <p>Create your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <RegisterForm onSubmit={handleRegisterSubmit} loading={loading} />

        <div className="auth-footer">
          <Link to="/login" className="auth-link">
            Already have an account? <strong>Login</strong>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
