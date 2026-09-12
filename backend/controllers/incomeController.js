const Income = require("../models/Income");

// Add Income
const addIncome = async (req, res) => {
  try {
    const {
      source,
      amount,
      description,
      date,
      paymentMethod,
    } = req.body;

    if (!source || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Source and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const income = await Income.create({
      user: req.user,
      source,
      amount,
      description,
      date: date || new Date(),
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income,
    });
  } catch (error) {
    console.error("Add Income Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get All Income
const getIncome = async (req, res) => {
  try {
    const income = await Income.find({
      user: req.user,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: income.length,
      income,
    });
  } catch (error) {
    console.error("Get Income Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get Single Income
const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.status(200).json({
      success: true,
      income,
    });
  } catch (error) {
    console.error("Get Income Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Update Income
const updateIncome = async (req, res) => {
  try {
    const {
      source,
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

    const income = await Income.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user,
      },
      {
        source,
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

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      income,
    });
  } catch (error) {
    console.error("Update Income Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Delete Income
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    console.error("Delete Income Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  addIncome,
  getIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
};