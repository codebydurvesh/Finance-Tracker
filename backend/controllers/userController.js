const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      monthlyBudget: user.monthlyBudget,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) {
      // Check if email already exists for another user
      const emailExists = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.user.id },
      });

      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = req.body.email;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      monthlyBudget: updatedUser.monthlyBudget,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update monthly budget
// @route   PUT /api/users/budget
// @access  Private
const updateBudget = async (req, res) => {
  try {
    const { monthlyBudget } = req.body;

    if (monthlyBudget === undefined) {
      return res.status(400).json({ message: "Please provide monthlyBudget" });
    }

    if (monthlyBudget < 0) {
      return res.status(400).json({ message: "Budget cannot be negative" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.monthlyBudget = monthlyBudget;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      monthlyBudget: updatedUser.monthlyBudget,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateBudget,
};
