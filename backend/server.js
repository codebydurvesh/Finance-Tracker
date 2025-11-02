// Only load .env in development (Render injects env vars directly)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
} else {
  console.log(
    "🚀 Running in production mode - using Render environment variables"
  );
}

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  console.error("Stack:", err.stack);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  console.error("Stack:", err.stack);
});

// Connect to MongoDB
connectDB();

// Email verification is now done on-demand when OTP is sent
// Commenting out startup verification to avoid blocking server startup
/*
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  const { verifyEmailConfig } = require("./config/emailConfig");
  verifyEmailConfig().catch((err) => {
    console.error("⚠️ Email configuration warning:", err.message);
    console.log(
      "🔧 OTP emails may not work. Check EMAIL_USER and EMAIL_PASSWORD env variables."
    );
  });
} else {
  console.log(
    "⚠️ Email credentials not found. OTP functionality will be disabled."
  );
  console.log(
    "💡 Set EMAIL_USER and EMAIL_PASSWORD environment variables to enable emails."
  );
}
*/

console.log(
  "📧 Email service configured. Brevo SMTP will be used for OTP emails."
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "💰 Finance Tracker API",
    status: "Server is running",
    version: "1.0.0",
  });
});

// Health check endpoint with email status
app.get("/api/health", async (req, res) => {
  try {
    const { verifyEmailConfig } = require("./config/emailConfig");
    const emailReady = await verifyEmailConfig();

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        api: "online",
        email: emailReady ? "ready" : "not configured",
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        emailUser: process.env.EMAIL_USER ? "configured" : "missing",
        emailPassword: process.env.EMAIL_PASSWORD ? "configured" : "missing",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Error handling middleware
app.use((err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
