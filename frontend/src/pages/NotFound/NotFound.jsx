import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="error-description">
          It seems you've ventured into uncharted territory. The page you're
          trying to reach may have been moved, deleted, or never existed.
        </p>
        <div className="notfound-actions">
          <button onClick={handleGoHome} className="home-btn">
            Go to Home
          </button>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
