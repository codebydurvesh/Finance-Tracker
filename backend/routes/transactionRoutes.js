const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransactionsByMonth,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// Summary route (must be before /:id to avoid conflict)
router.get("/summary", getTransactionSummary);

// Month-based route
router.get("/month/:year/:month", getTransactionsByMonth);

// Main CRUD routes
router.route("/").get(getTransactions).post(createTransaction);

router
  .route("/:id")
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
