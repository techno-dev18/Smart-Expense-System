
const express = require("express");

const {
  addMonthlyBudget,
  getBudgets,
  updateMonthlyBudget,
  deleteMonthlyBudget,
  addCategoryBudget,
  getBudgetById,
  updateCategoryBudget,
  deleteCategoryBudget,
} = require("../controllers/budgetController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All budget endpoints require authentication.
router.use(protect);

// Monthly budgets — register these before /:id.
router.get("/", getBudgets);
router.post("/monthly", addMonthlyBudget);
router.put("/monthly/:id", updateMonthlyBudget);
router.delete("/monthly/:id", deleteMonthlyBudget);

// Category budgets.
router.post("/category", addCategoryBudget);
router.get("/:id", getBudgetById);
router.put("/:id", updateCategoryBudget);
router.delete("/:id", deleteCategoryBudget);

module.exports = router;
