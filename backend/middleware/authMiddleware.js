// Auth middleware will be implemented in Task 4
// This will verify JWT tokens and protect routes

const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  // TODO: Implement JWT verification
  // Will be completed in Task 4
  next();
};

module.exports = { protect };
