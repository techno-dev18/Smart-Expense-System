const Budget = require("../models/Budget");

// Add Budget
const addBudget = async (req, res) => {
  try {
    const {
      category,
      amount,
      month,
      year,
    } = req.body;

    if (
      !category ||
      amount === undefined ||
      !month ||
      !year
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Category, amount, month and year are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget amount must be greater than 0",
      });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    const existingBudget = await Budget.findOne({
      user: req.user,
      category,
      month,
      year,
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message:
          "Budget already exists for this category and month",
      });
    }

    const budget = await Budget.create({
      user: req.user,
      category,
      amount,
      month,
      year,
    });

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    console.error("Add Budget Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get All Budgets
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user,
    }).sort({
      year: -1,
      month: -1,
    });

    res.status(200).json({
      success: true,
      count: budgets.length,
      budgets,
    });
  } catch (error) {
    console.error("Get Budgets Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get Single Budget
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      budget,
    });
  } catch (error) {
    console.error("Get Budget Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Update Budget
const updateBudget = async (req, res) => {
  try {
    const {
      category,
      amount,
      month,
      year,
    } = req.body;

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Budget amount must be greater than 0",
      });
    }

    if (
      month !== undefined &&
      (month < 1 || month > 12)
    ) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    const budget = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user,
      },
      {
        category,
        amount,
        month,
        year,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error("Update Budget Error:", error);

    // Duplicate budget
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Budget already exists for this category and month",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Delete Budget
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete Budget Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  addBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};