const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateBudget,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// User profile routes
router.route("/me").get(getUserProfile).put(updateUserProfile);

// Budget route
router.put("/budget", updateBudget);

module.exports = router;
