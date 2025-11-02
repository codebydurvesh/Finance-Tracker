// Create reusable transporter
const createTransporter = () => {
  // Import nodemailer here to avoid module caching issues
  const nodemailer = require("nodemailer");

  // Validate nodemailer loaded correctly
  if (!nodemailer || typeof nodemailer.createTransport !== "function") {
    console.error("❌ nodemailer.createTransport is not available");
    throw new Error(
      "Email service unavailable - nodemailer not loaded correctly"
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
