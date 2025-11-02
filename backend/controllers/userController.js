const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const Transaction = require("../models/Transaction");
const { generateOTP, sendOTP } = require("../services/emailService");

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
      googleId: user.googleId,
      profilePicture: user.profilePicture,
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
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        monthlyBudget: updatedUser.monthlyBudget,
        googleId: updatedUser.googleId,
        profilePicture: updatedUser.profilePicture,
      },
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

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide both current and new password" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // Get user with password field
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has a password (not a Google user)
    if (!user.password) {
      return res.status(400).json({
        message: "Cannot change password for Google authenticated users",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP for email change
// @route   POST /api/users/change-email/send-otp
// @access  Private
const sendEmailChangeOTP = async (req, res) => {
  try {
    console.log("📧 Email change OTP request received");
    console.log("User ID:", req.user?.id);
    console.log("Request body:", req.body);

    const { newEmail } = req.body;

    // Validation
    if (!newEmail) {
      console.log("❌ No email provided");
      return res
        .status(400)
        .json({ message: "Please provide a new email address" });
    }

    // Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(newEmail)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }

    const normalizedEmail = newEmail.toLowerCase();

    // Check if this is the same as current email
    const currentUser = await User.findById(req.user.id);
    if (currentUser.email === normalizedEmail) {
      return res
        .status(400)
        .json({ message: "This is already your current email address" });
    }

    // Check if email already exists for another user
    const emailExists = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.id },
    });

    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check for recent OTP requests (rate limiting)
    const recentOTP = await OTP.findOne({
      email: normalizedEmail,
      createdAt: { $gte: new Date(Date.now() - 60000) }, // Within last 1 minute
    });

    if (recentOTP) {
      return res.status(429).json({
        message: "Please wait 1 minute before requesting another OTP",
      });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail });

    // Generate and save OTP
    const otpCode = generateOTP();
    console.log("🔐 Generated OTP:", otpCode);

    const otp = new OTP({
      email: normalizedEmail,
      otp: otpCode,
    });

    await otp.save();
    console.log("💾 OTP saved to database");

    // Send OTP email
    console.log("📨 Attempting to send email to:", normalizedEmail);
    await sendOTP(normalizedEmail, otpCode);
    console.log("✅ Email sent successfully");

    res.json({
      message: "OTP sent successfully to your new email address",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Send Email Change OTP error:", error);

    // More specific error messages
    if (error.message.includes("Invalid login")) {
      return res.status(500).json({
        message: "Email configuration error. Please contact support.",
      });
    }

    if (error.message.includes("Failed to send OTP email")) {
      return res.status(500).json({
        message: error.message || "Failed to send OTP. Please try again.",
      });
    }

    res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

// @desc    Verify OTP and update email
// @route   POST /api/users/change-email/verify-otp
// @access  Private
const verifyEmailChangeOTP = async (req, res) => {
  try {
    const { newEmail, otp } = req.body;

    // Validation
    if (!newEmail || !otp) {
      return res
        .status(400)
        .json({ message: "Please provide both email and OTP" });
    }

    const normalizedEmail = newEmail.toLowerCase();

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp: otp,
      verified: false,
    });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP. Please request a new one." });
    }

    // Check attempts
    if (otpRecord.attempts >= parseInt(process.env.OTP_MAX_ATTEMPTS || 3)) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        message: "Maximum attempts exceeded. Please request a new OTP.",
      });
    }

    // Check if OTP is expired (TTL index handles this, but double check)
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || 10);
    const expiryTime = new Date(
      otpRecord.createdAt.getTime() + expiryMinutes * 60000
    );

    if (new Date() > expiryTime) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remainingAttempts =
        parseInt(process.env.OTP_MAX_ATTEMPTS || 3) - otpRecord.attempts;

      return res.status(400).json({
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
      });
    }

    // OTP is valid - update user email
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Double-check email isn't taken by another user
    const emailExists = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.id },
    });

    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Update email
    user.email = normalizedEmail;
    const updatedUser = await user.save();

    // Mark OTP as verified and delete
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({
      message: "Email updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        monthlyBudget: updatedUser.monthlyBudget,
        googleId: updatedUser.googleId,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Verify Email Change OTP error:", error);
    res
      .status(500)
      .json({ message: "Failed to verify OTP. Please try again." });
  }
};

// @desc    Send OTP for account deletion
// @route   POST /api/users/delete-account/send-otp
// @access  Private
const sendAccountDeletionOTP = async (req, res) => {
  try {
    console.log("🗑️ Account deletion OTP request received");
    console.log("User ID:", req.user?.id);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userEmail = user.email;

    // Check for recent OTP requests (rate limiting)
    const recentOTP = await OTP.findOne({
      email: userEmail,
      createdAt: { $gte: new Date(Date.now() - 60000) }, // Within last 1 minute
    });

    if (recentOTP) {
      return res.status(429).json({
        message: "Please wait 1 minute before requesting another OTP",
      });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: userEmail });

    // Generate and save OTP
    const otpCode = generateOTP();
    console.log("🔐 Generated OTP for account deletion:", otpCode);

    const otp = new OTP({
      email: userEmail,
      otp: otpCode,
    });

    await otp.save();
    console.log("💾 OTP saved to database");

    // Send OTP email with custom message for account deletion
    console.log("📨 Attempting to send deletion OTP email to:", userEmail);
    await sendAccountDeletionEmail(userEmail, otpCode);
    console.log("✅ Deletion OTP email sent successfully");

    res.json({
      message: "OTP sent successfully to your email",
      email: userEmail,
    });
  } catch (error) {
    console.error("Send Account Deletion OTP error:", error);

    if (error.message.includes("Invalid login")) {
      return res.status(500).json({
        message: "Email configuration error. Please contact support.",
      });
    }

    if (error.message.includes("Failed to send OTP email")) {
      return res.status(500).json({
        message: error.message || "Failed to send OTP. Please try again.",
      });
    }

    res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

// @desc    Verify OTP and delete account
// @route   POST /api/users/delete-account/verify-otp
// @access  Private
const verifyAndDeleteAccount = async (req, res) => {
  try {
    console.log("🗑️ Account deletion verification request received");
    const { otp } = req.body;

    // Validation
    if (!otp) {
      return res.status(400).json({ message: "Please provide the OTP" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userEmail = user.email;

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: userEmail,
      otp: otp,
      verified: false,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP. Please request a new one.",
      });
    }

    // Check attempts
    if (otpRecord.attempts >= parseInt(process.env.OTP_MAX_ATTEMPTS || 3)) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        message: "Maximum attempts exceeded. Please request a new OTP.",
      });
    }

    // Check if OTP is expired
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || 10);
    const expiryTime = new Date(
      otpRecord.createdAt.getTime() + expiryMinutes * 60000
    );

    if (new Date() > expiryTime) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remainingAttempts =
        parseInt(process.env.OTP_MAX_ATTEMPTS || 3) - otpRecord.attempts;

      return res.status(400).json({
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
      });
    }

    // OTP is valid - delete user account and all associated data
    console.log("🗑️ Deleting user account:", user.email);

    // Delete user's transactions
    const deletedTransactions = await Transaction.deleteMany({
      user: req.user.id,
    });
    console.log(`🗑️ Deleted ${deletedTransactions.deletedCount} transactions`);

    // Delete the OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Delete any remaining OTPs for this email
    await OTP.deleteMany({ email: userEmail });

    // Delete the user
    await User.findByIdAndDelete(req.user.id);

    console.log("✅ Account deleted successfully");

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Verify and Delete Account error:", error);
    res.status(500).json({
      message: "Failed to delete account. Please try again.",
    });
  }
};

// Helper function to send account deletion email
const sendAccountDeletionEmail = async (email, otp) => {
  const { createTransporter } = require("../config/emailConfig");

  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #f44336 0%, #c62828 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .otp-box {
          background: #f8f9fa;
          border: 2px dashed #f44336;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #f44336;
        }
        .message {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
          margin: 20px 0;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          color: #856404;
          font-size: 14px;
        }
        .danger {
          background: #fee;
          border-left: 4px solid #f44336;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          color: #c33;
          font-size: 14px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Finance Tracker</h1>
          <p style="margin: 10px 0 0 0;">Account Deletion Request</p>
        </div>
        <div class="content">
          <h2 style="color: #f44336; margin-bottom: 10px;">⚠️ Confirm Account Deletion</h2>
          <p class="message">
            We received a request to delete your Finance Tracker account. 
            To confirm this action, please use the following One-Time Password (OTP):
          </p>
          <div class="otp-box">${otp}</div>
          <p class="message">
            This OTP is valid for <strong>10 minutes</strong>. 
            Please do not share this code with anyone.
          </p>
          <div class="danger">
            <strong>⚠️ IMPORTANT:</strong><br>
            This action is <strong>permanent and cannot be undone</strong>. 
            All your data, including transactions, budgets, and settings will be permanently deleted.
          </div>
          <div class="warning">
            <strong>🛡️ Security Note:</strong><br>
            If you didn't request account deletion, please ignore this email and consider changing your password immediately. 
            Your account security is important to us.
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 8px 0;">© 2025 Finance Tracker. All rights reserved.</p>
          <p style="margin: 0 0 5px 0; font-size: 12px;">
            Contact: <a href="mailto:durvesh.gaikwad08@gmail.com" style="color: #f44336; text-decoration: none;">durvesh.gaikwad08@gmail.com</a> | 
            <a href="tel:+919136608240" style="color: #f44336; text-decoration: none;">+91 9136608240</a>
          </p>
          <p style="margin: 0; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        "Finance Tracker <noreply@financetracker.com>",
      to: email,
      subject: "⚠️ Account Deletion Verification - Finance Tracker",
      html: emailTemplate,
      text: `Your Finance Tracker account deletion verification code is: ${otp}. This code is valid for 10 minutes. WARNING: This action is permanent and cannot be undone. If you didn't request this, please ignore this email and secure your account.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Account deletion OTP email sent successfully to:", email);
    console.log("📧 Message ID:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending account deletion OTP email:", error);
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateBudget,
  changePassword,
  sendEmailChangeOTP,
  verifyEmailChangeOTP,
  sendAccountDeletionOTP,
  verifyAndDeleteAccount,
};
