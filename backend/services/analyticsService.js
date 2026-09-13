const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Budget = require("../models/Budget");

const runCppAnalytics = require("./cppService");


// ==========================================
// GET USER ANALYTICS
// ==========================================

const getUserAnalytics = async (userId) => {

  const expenses = await Expense.find({
    user: userId,
  }).sort({
    date: 1,
  });


  const income = await Income.find({
    user: userId,
  }).sort({
    date: 1,
  });


  const budgets = await Budget.find({
    user: userId,
  }).sort({
    year: 1,
    month: 1,
  });


  const transactions = [];


  // ==========================================
  // INCOME
  // ==========================================

  income.forEach((item) => {

    transactions.push({
      type: "income",

      category: item.source,

      amount: item.amount,

      date: item.date
        ? new Date(item.date)
            .toISOString()
            .split("T")[0]
        : "",
    });

  });


  // ==========================================
  // EXPENSES
  // ==========================================

  expenses.forEach((item) => {

    transactions.push({
      type: "expense",

      category: item.category,

      amount: item.amount,

      date: item.date
        ? new Date(item.date)
            .toISOString()
            .split("T")[0]
        : "",
    });

  });


  // ==========================================
  // BUDGETS
  // ==========================================

  budgets.forEach((item) => {

    const month =
      String(item.year).padStart(4, "0") +
      "-" +
      String(item.month).padStart(2, "0");


    transactions.push({
      type: "budget",

      category: item.category,

      amount: item.amount,

      date: month,
    });

  });


  // ==========================================
  // RUN C++ ANALYTICS
  // ==========================================

  const cppOutput =
    await runCppAnalytics(
      transactions
    );


  // ==========================================
  // PARSE C++ OUTPUT
  // ==========================================

  return parseCppOutput(
    cppOutput
  );
};


// ==========================================
// PARSE C++ OUTPUT
// ==========================================

const parseCppOutput = (output) => {

  const lines = output
    .trim()
    .split(/\r?\n/);


  const analytics = {

    totalIncome: 0,

    totalExpenses: 0,

    balance: 0,

    savingsRate: 0,

    averageExpense: 0,

    topCategory: "",


    categorySpending: {},

    monthlyExpenses: {},

    monthlyIncome: {},

    monthlyBalance: {},


    budgetActual: {},

    budgetRemaining: {},

    budgetUsage: {},

    budgetOverspending: {},

    budgetInsights: [],
  };


  let section = "";


  // ==========================================
  // PROCESS EACH LINE
  // ==========================================

  lines.forEach((line) => {

    line = line.trim();


    if (!line) {
      return;
    }


    // ========================================
    // SECTION HEADERS
    // ========================================

    if (line === "CATEGORY_SPENDING=") {

      section = "categorySpending";

      return;
    }


    if (line === "MONTHLY_EXPENSES=") {

      section = "monthlyExpenses";

      return;
    }


    if (line === "MONTHLY_INCOME=") {

      section = "monthlyIncome";

      return;
    }


    if (line === "MONTHLY_BALANCE=") {

      section = "monthlyBalance";

      return;
    }


    if (line === "BUDGET_ACTUAL=") {

      section = "budgetActual";

      return;
    }


    if (line === "BUDGET_REMAINING=") {

      section = "budgetRemaining";

      return;
    }


    if (line === "BUDGET_USAGE=") {

      section = "budgetUsage";

      return;
    }


    if (line === "BUDGET_OVERSPENDING=") {

      section = "budgetOverspending";

      return;
    }


    if (line === "BUDGET_INSIGHTS=") {

      section = "budgetInsights";

      return;
    }


    // ========================================
    // BUDGET INSIGHTS
    // ========================================
    //
    // Important:
    // Insight lines don't have "=".
    //
    // Example:
    //
    // Watch your Food spending. You have
    // used 83.3333% of your budget.
    //
    // ========================================

    if (section === "budgetInsights") {

      analytics.budgetInsights.push(
        line
      );

      return;
    }


    // ========================================
    // FIND KEY/VALUE SEPARATOR
    // ========================================

    const separatorIndex =
      line.indexOf("=");


    if (separatorIndex === -1) {

      return;
    }


    const key =
      line.substring(
        0,
        separatorIndex
      );


    const value =
      line.substring(
        separatorIndex + 1
      );


    // ========================================
    // CATEGORY SPENDING
    // ========================================

    if (
      section === "categorySpending"
    ) {

      analytics.categorySpending[key] =
        Number(value);

      return;
    }


    // ========================================
    // MONTHLY EXPENSES
    // ========================================

    if (
      section === "monthlyExpenses"
    ) {

      analytics.monthlyExpenses[key] =
        Number(value);

      return;
    }


    // ========================================
    // MONTHLY INCOME
    // ========================================

    if (
      section === "monthlyIncome"
    ) {

      analytics.monthlyIncome[key] =
        Number(value);

      return;
    }


    // ========================================
    // MONTHLY BALANCE
    // ========================================

    if (
      section === "monthlyBalance"
    ) {

      analytics.monthlyBalance[key] =
        Number(value);

      return;
    }


    // ========================================
    // BUDGET ACTUAL
    // ========================================

    if (
      section === "budgetActual"
    ) {

      analytics.budgetActual[key] =
        Number(value);

      return;
    }


    // ========================================
    // BUDGET REMAINING
    // ========================================

    if (
      section === "budgetRemaining"
    ) {

      analytics.budgetRemaining[key] =
        Number(value);

      return;
    }


    // ========================================
    // BUDGET USAGE
    // ========================================

    if (
      section === "budgetUsage"
    ) {

      analytics.budgetUsage[key] =
        Number(value);

      return;
    }


    // ========================================
    // BUDGET OVERSPENDING
    // ========================================

    if (
      section === "budgetOverspending"
    ) {

      analytics.budgetOverspending[key] =
        Number(value);

      return;
    }


    // ========================================
    // BASIC ANALYTICS
    // ========================================

    switch (key) {

      case "TOTAL_INCOME":

        analytics.totalIncome =
          Number(value);

        break;


      case "TOTAL_EXPENSES":

        analytics.totalExpenses =
          Number(value);

        break;


      case "BALANCE":

        analytics.balance =
          Number(value);

        break;


      case "SAVINGS_RATE":

        analytics.savingsRate =
          Number(value);

        break;


      case "AVERAGE_EXPENSE":

        analytics.averageExpense =
          Number(value);

        break;


      case "TOP_CATEGORY":

        analytics.topCategory =
          value;

        break;


      default:

        break;
    }

  });


  return analytics;
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getUserAnalytics,
};