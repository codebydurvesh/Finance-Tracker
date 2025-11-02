const express = require("express");
const router = express.Router();
const {
  sendOTPEmail,
  verifyOTPCode,
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { googleLogin } = require("../controllers/googleAuthController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/send-otp", sendOTPEmail);
router.post("/verify-otp", verifyOTPCode);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

// Protected route
router.get("/me", protect, getMe);

module.exports = router;
