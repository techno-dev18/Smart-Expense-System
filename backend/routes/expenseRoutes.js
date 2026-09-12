const express = require("express");

const {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All expense routes require authentication
router.use(protect);

// Add expense
router.post("/", addExpense);

// Get all expenses
router.get("/", getExpenses);

// Get single expense
router.get("/:id", getExpenseById);

// Update expense
router.put("/:id", updateExpense);

// Delete expense
router.delete("/:id", deleteExpense);

module.exports = router;