const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true, // Index for faster user-based queries
    },
    title: {
      type: String,
      required: [true, "Please add a transaction title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      required: [true, "Please specify transaction type"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense",
      },
    },
    category: {
      type: String,
      trim: true,
      default: "Other",
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Compound index for efficient queries by user and date
transactionSchema.index({ user: 1, date: -1 });

// Index for filtering by type
transactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
