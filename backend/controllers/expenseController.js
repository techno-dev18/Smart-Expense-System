const Expense = require("../models/Expense");

// Add Expense
const addExpense = async (req, res) => {
  try {
    const {
      category,
      amount,
      description,
      date,
      paymentMethod,
    } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Category and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const expense = await Expense.create({
      user: req.user,
      category,
      amount,
      description,
      date: date || new Date(),
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get All Expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get Single Expense
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Get Expense Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Update Expense
const updateExpense = async (req, res) => {
  try {
    const {
      category,
      amount,
      description,
      date,
      paymentMethod,
    } = req.body;

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user,
      },
      {
        category,
        amount,
        description,
        date,
        paymentMethod,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};