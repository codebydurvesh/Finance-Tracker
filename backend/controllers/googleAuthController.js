const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified by Google" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google account
      user = new User({
        name,
        email,
        googleId: payload.sub,
        profilePicture: picture,
        monthlyBudget: 0,
      });

      // Set a random password to satisfy the schema, but it won't be used
      user.password = Math.random().toString(36).slice(-8);
      await user.save({ validateBeforeSave: false });
    } else {
      // Update existing user with Google ID if not set
      if (!user.googleId) {
        user.googleId = payload.sub;
        user.profilePicture = picture;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
};

module.exports = { googleLogin };
