
const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const MonthlyBudget = require("../models/MonthlyBudget");

// Return the authenticated user's ID whether middleware supplies
// an ObjectId or a user document.
const getUserId = (req) => req.user?._id || req.user;

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const addMonthlyBudget = async (req, res) => {
  try {
    const user = getUserId(req);
    const { totalAmount, month, year } = req.body;

    if (
      !Number.isFinite(Number(totalAmount)) ||
      Number(totalAmount) <= 0 ||
      !Number.isInteger(Number(month)) ||
      Number(month) < 1 ||
      Number(month) > 12 ||
      !Number.isInteger(Number(year)) ||
      Number(year) < 2000 ||
      Number(year) > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid amount, month and year.",
      });
    }

    const monthlyBudget = await MonthlyBudget.create({
      user,
      totalAmount: Number(totalAmount),
      month: Number(month),
      year: Number(year),
    });

    return res.status(201).json({
      success: true,
      message: "Monthly budget created successfully.",
      monthlyBudget,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A monthly budget already exists for this month.",
      });
    }

    console.error("Add Monthly Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const getBudgets = async (req, res) => {
  try {
    const user = getUserId(req);

    const [monthlyBudgets, budgets] = await Promise.all([
      MonthlyBudget.find({ user }).sort({ year: -1, month: -1 }),
      Budget.find({ user }).sort({ category: 1 }),
    ]);

    return res.status(200).json({
      success: true,
      monthlyBudgets,
      budgets,
    });
  } catch (error) {
    console.error("Get Budgets Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const updateMonthlyBudget = async (req, res) => {
  try {
    const user = getUserId(req);
    const { id } = req.params;
    const { totalAmount } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid monthly budget ID.",
      });
    }

    if (
      !Number.isFinite(Number(totalAmount)) ||
      Number(totalAmount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Budget amount must be greater than zero.",
      });
    }

    const monthlyBudget = await MonthlyBudget.findOne({
      _id: id,
      user,
    });

    if (!monthlyBudget) {
      return res.status(404).json({
        success: false,
        message: "Monthly budget not found.",
      });
    }

    const allocation = await Budget.aggregate([
      {
        $match: {
          user: monthlyBudget.user,
          monthlyBudget: monthlyBudget._id,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const allocatedAmount = allocation[0]?.total || 0;

    if (Number(totalAmount) < allocatedAmount) {
      return res.status(400).json({
        success: false,
        message: "Monthly budget cannot be less than its category allocations.",
      });
    }

    monthlyBudget.totalAmount = Number(totalAmount);
    await monthlyBudget.save();

    return res.status(200).json({
      success: true,
      message: "Monthly budget updated successfully.",
      monthlyBudget,
    });
  } catch (error) {
    console.error("Update Monthly Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const deleteMonthlyBudget = async (req, res) => {
  try {
    const user = getUserId(req);
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid monthly budget ID.",
      });
    }

    const monthlyBudget = await MonthlyBudget.findOne({
      _id: id,
      user,
    });

    if (!monthlyBudget) {
      return res.status(404).json({
        success: false,
        message: "Monthly budget not found.",
      });
    }

    const hasCategories = await Budget.exists({
      user,
      monthlyBudget: monthlyBudget._id,
    });

    if (hasCategories) {
      return res.status(400).json({
        success: false,
        message: "Delete its category budgets before deleting this monthly budget.",
      });
    }

    await monthlyBudget.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Monthly budget deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Monthly Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const addCategoryBudget = async (req, res) => {
  try {
    const user = getUserId(req);
    const { monthlyBudgetId, category, amount } = req.body;

    if (
      !monthlyBudgetId ||
      !isValidId(monthlyBudgetId) ||
      typeof category !== "string" ||
      !category.trim() ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Monthly budget, category and a positive amount are required.",
      });
    }

    const monthlyBudget = await MonthlyBudget.findOne({
      _id: monthlyBudgetId,
      user,
    });

    if (!monthlyBudget) {
      return res.status(404).json({
        success: false,
        message: "Monthly budget not found.",
      });
    }

    const existingCategory = await Budget.findOne({
      user,
      monthlyBudget: monthlyBudget._id,
      category: category.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "This category already has a budget for the selected month.",
      });
    }

    const allocation = await Budget.aggregate([
      {
        $match: {
          user: monthlyBudget.user,
          monthlyBudget: monthlyBudget._id,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const allocatedAmount = allocation[0]?.total || 0;
    const newAmount = Number(amount);

    if (allocatedAmount + newAmount > monthlyBudget.totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Category budgets cannot exceed the monthly budget.",
      });
    }

    const budget = await Budget.create({
      user,
      monthlyBudget: monthlyBudget._id,
      category: category.trim(),
      amount: newAmount,
      month: monthlyBudget.month,
      year: monthlyBudget.year,
    });

    return res.status(201).json({
      success: true,
      message: "Category budget created successfully.",
      budget,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This category budget already exists.",
      });
    }

    console.error("Add Category Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const getBudgetById = async (req, res) => {
  try {
    const user = getUserId(req);
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget ID.",
      });
    }

    const budget = await Budget.findOne({ _id: id, user });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    return res.status(200).json({ success: true, budget });
  } catch (error) {
    console.error("Get Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const updateCategoryBudget = async (req, res) => {
  try {
    const user = getUserId(req);
    const { id } = req.params;
    const { category, amount } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget ID.",
      });
    }

    const budget = await Budget.findOne({ _id: id, user });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    // Legacy category records have no parent monthly budget.
    // Do not silently assign them to an arbitrary month.
    if (!budget.monthlyBudget) {
      return res.status(400).json({
        success: false,
        message: "This legacy budget needs to be migrated before it can be updated here.",
      });
    }

    const monthlyBudget = await MonthlyBudget.findOne({
      _id: budget.monthlyBudget,
      user,
    });

    if (!monthlyBudget) {
      return res.status(400).json({
        success: false,
        message: "The parent monthly budget could not be found.",
      });
    }

    if (
      amount !== undefined &&
      (!Number.isFinite(Number(amount)) || Number(amount) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Budget amount must be greater than zero.",
      });
    }

    const nextCategory =
      typeof category === "string" && category.trim()
        ? category.trim()
        : budget.category;

    const nextAmount =
      amount === undefined ? budget.amount : Number(amount);

    const duplicate = await Budget.findOne({
      _id: { $ne: budget._id },
      user,
      monthlyBudget: monthlyBudget._id,
      category: nextCategory,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "This category already has a budget for the selected month.",
      });
    }

    const allocation = await Budget.aggregate([
      {
        $match: {
          user: monthlyBudget.user,
          monthlyBudget: monthlyBudget._id,
          _id: { $ne: budget._id },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const otherAllocations = allocation[0]?.total || 0;

    if (otherAllocations + nextAmount > monthlyBudget.totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Category budgets cannot exceed the monthly budget.",
      });
    }

    budget.category = nextCategory;
    budget.amount = nextAmount;
    await budget.save();

    return res.status(200).json({
      success: true,
      message: "Category budget updated successfully.",
      budget,
    });
  } catch (error) {
    console.error("Update Category Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const deleteCategoryBudget = async (req, res) => {
  try {
    const user = getUserId(req);
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget ID.",
      });
    }

    const budget = await Budget.findOneAndDelete({
      _id: id,
      user,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category budget deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Category Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  addMonthlyBudget,
  getBudgets,
  updateMonthlyBudget,
  deleteMonthlyBudget,
  addCategoryBudget,
  getBudgetById,
  updateCategoryBudget,
  deleteCategoryBudget,
};
