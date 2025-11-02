// Import nodemailer with better error handling
let nodemailer;
try {
  nodemailer = require("nodemailer");
  if (!nodemailer || typeof nodemailer.createTransport !== "function") {
    console.error(
      "❌ nodemailer imported but createTransport is not a function"
    );
    console.error("Trying default import...");
    nodemailer = require("nodemailer").default || require("nodemailer");
  }
} catch (error) {
  console.error("❌ Failed to import nodemailer:", error.message);
  throw error;
}

// Create reusable transporter
const createTransporter = () => {
  if (!nodemailer || typeof nodemailer.createTransport !== "function") {
    throw new Error(
      "nodemailer.createTransport is not available. Please reinstall nodemailer."
    );
  }
  // Use custom SMTP settings if provided, otherwise use Gmail
  const config = process.env.EMAIL_HOST
    ? {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };

  return nodemailer.createTransporter({
    ...config,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email service is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email service configuration error:", error.message);
    return false;
  }
};

module.exports = {
  createTransporter,
  verifyEmailConfig,
};
