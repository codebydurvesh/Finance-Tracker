import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-contact">
          <a href="mailto:durvesh.gaikwad08@gmail.com" className="footer-link">
            ✉ durvesh.gaikwad08@gmail.com
          </a>
          <span className="separator">•</span>
          <a href="tel:+919136608240" className="footer-link">
            ☎ +91 9136608240
          </a>
        </div>
        <p className="copyright">
          © 2025-26 Finance Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
