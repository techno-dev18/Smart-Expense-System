const express = require("express");

const {
  addIncome,
  getIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All income routes require authentication
router.use(protect);

// Add income
router.post("/", addIncome);

// Get all income
router.get("/", getIncome);

// Get single income
router.get("/:id", getIncomeById);

// Update income
router.put("/:id", updateIncome);

// Delete income
router.delete("/:id", deleteIncome);

module.exports = router;