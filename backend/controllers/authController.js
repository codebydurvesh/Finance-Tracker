const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const { generateOTP, sendOTP } = require("../services/emailService");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTPEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide an email address" });
    }

    // Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Email already registered. Please login." });
    }

    // Check for recent OTP requests (rate limiting)
    const recentOTP = await OTP.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 60000) }, // Within last 1 minute
    });

    if (recentOTP) {
      return res.status(429).json({
        message: "Please wait before requesting another OTP",
        retryAfter: 60,
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing unverified OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase(), verified: false });

    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      verified: false,
      attempts: 0,
    });

    // Send OTP email
    await sendOTP(email, otp);

    res.status(200).json({
      message: "OTP sent successfully to your email",
      email: email.toLowerCase(),
      expiresIn: 600, // 10 minutes in seconds
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTPCode = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide email and OTP" });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      verified: false,
    }).sort({ createdAt: -1 }); // Get the most recent OTP

    if (!otpRecord) {
      return res
        .status(400)
        .json({
          message: "OTP expired or not found. Please request a new one.",
        });
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res
        .status(400)
        .json({
          message:
            "Maximum verification attempts exceeded. Please request a new OTP.",
        });
    }

    // Verify OTP
    if (otpRecord.otp !== otp.toString()) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
        attemptsLeft: 3 - otpRecord.attempts,
      });
    }

    // OTP is correct - mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Generate a temporary token for registration
    const verificationToken = jwt.sign(
      { email: email.toLowerCase(), verified: true },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Valid for 15 minutes
    );

    res.status(200).json({
      message: "Email verified successfully",
      verificationToken,
      email: email.toLowerCase(),
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: error.message || "Failed to verify OTP" });
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, verificationToken } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }

    if (!verificationToken) {
      return res.status(400).json({ message: "Email verification required" });
    }

    // Verify the verification token
    let decodedToken;
    try {
      decodedToken = jwt.verify(verificationToken, process.env.JWT_SECRET);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    // Check if token email matches provided email
    if (decodedToken.email !== email.toLowerCase()) {
      return res
        .status(400)
        .json({ message: "Email mismatch with verification" });
    }

    // Check if email was verified
    if (!decodedToken.verified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (user) {
      // Clean up verified OTP records for this email
      await OTP.deleteMany({ email: email.toLowerCase(), verified: true });

      res.status(201).json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          monthlyBudget: user.monthlyBudget,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }

    // Check for user email - explicitly select password field
    const user = await User.findOne({ email }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          monthlyBudget: user.monthlyBudget,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      monthlyBudget: user.monthlyBudget,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOTPEmail,
  verifyOTPCode,
  registerUser,
  loginUser,
  getMe,
};
