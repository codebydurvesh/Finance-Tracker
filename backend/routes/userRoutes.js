const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateBudget,
  changePassword,
  changeEmail,
  deleteAccount,
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

// Email change route (with password confirmation)
router.put("/change-email", changeEmail);

// Account deletion route (with password confirmation)
router.delete("/delete-account", deleteAccount);

module.exports = router;
