const express = require("express");

const {
  addBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All budget routes require authentication
router.use(protect);

// Add budget
router.post("/", addBudget);

// Get all budgets
router.get("/", getBudgets);

// Get single budget
router.get("/:id", getBudgetById);

// Update budget
router.put("/:id", updateBudget);

// Delete budget
router.delete("/:id", deleteBudget);

module.exports = router;