
const mongoose = require("mongoose");

const monthlyBudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
  },
  {
    timestamps: true,
  }
);

// One monthly budget per user for each month and year.
monthlyBudgetSchema.index(
  {
    user: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "MonthlyBudget",
  monthlyBudgetSchema
);
