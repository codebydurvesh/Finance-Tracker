const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // TTL index - document will be deleted after 10 minutes (600 seconds)
  },
});

// Compound index for faster queries
otpSchema.index({ email: 1, verified: 1 });

module.exports = mongoose.model("OTP", otpSchema);
