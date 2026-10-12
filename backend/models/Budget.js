
const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    monthlyBudget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MonthlyBudget",
      // Optional temporarily for legacy records.
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Retained for compatibility with existing records.
    month: {
      type: Number,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index(
  {
    user: 1,
    category: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
    // Keep your existing index during the migration.
  }
);

module.exports = mongoose.model("Budget", budgetSchema);
