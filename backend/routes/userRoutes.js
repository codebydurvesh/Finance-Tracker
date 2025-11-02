const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateBudget,
  changePassword,
  sendEmailChangeOTP,
  verifyEmailChangeOTP,
  sendAccountDeletionOTP,
  verifyAndDeleteAccount,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// User profile routes
router.route("/me").get(getUserProfile).put(updateUserProfile);

// Budget route
router.put("/budget", updateBudget);

// Password route
router.put("/password", changePassword);

// Email change routes (with OTP verification)
router.post("/change-email/send-otp", sendEmailChangeOTP);
router.post("/change-email/verify-otp", verifyEmailChangeOTP);

// Account deletion routes (with OTP verification)
router.post("/delete-account/send-otp", sendAccountDeletionOTP);
router.post("/delete-account/verify-otp", verifyAndDeleteAccount);

module.exports = router;
