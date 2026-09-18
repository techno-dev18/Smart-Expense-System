const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Budget = require("../models/Budget");

const runCppAnalytics = require("./cppService");


// ==========================================
// GET USER ANALYTICS
// ==========================================

const getUserAnalytics = async (userId) => {

  // Fetch all collections in parallel
  const [
    expenses,
    income,
    budgets,
  ] = await Promise.all([

    Expense.find({
      user: userId,
    })
      .sort({
        date: 1,
      })
      .lean(),

    Income.find({
      user: userId,
    })
      .sort({
        date: 1,
      })
      .lean(),

    Budget.find({
      user: userId,
    })
      .sort({
        year: 1,
        month: 1,
      })
      .lean(),

  ]);


  const transactions = [];

  // ==========================================
  // INCOME
  // ==========================================

  income.forEach((item) => {

    transactions.push({
      type: "income",

      category: item.source,

      amount: Number(item.amount),

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

      amount: Number(item.amount),

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

      amount: Number(item.amount),

      date: month,
    });

  });


  // ==========================================
  // RUN C++ ANALYTICS
  // ==========================================

  const cppOutput = await runCppAnalytics(
    transactions
  );


  // ==========================================
  // PARSE C++ OUTPUT
  // ==========================================

  return parseCppOutput(cppOutput);

};


// ==========================================
// PARSE C++ OUTPUT
// ==========================================

const parseCppOutput = (output) => {

  const lines = String(output || "")
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

    if (section === "budgetInsights") {

      analytics.budgetInsights.push(line);

      return;
    }


    // ========================================
    // FIND KEY/VALUE SEPARATOR
    // ========================================

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }


    const key = line
      .substring(0, separatorIndex)
      .trim();


    const value = line
      .substring(separatorIndex + 1)
      .trim();


    // ========================================
    // NUMERIC SECTIONS
    // ========================================

    const numericSections = {

      categorySpending:
        analytics.categorySpending,

      monthlyExpenses:
        analytics.monthlyExpenses,

      monthlyIncome:
        analytics.monthlyIncome,

      monthlyBalance:
        analytics.monthlyBalance,

      budgetActual:
        analytics.budgetActual,

      budgetRemaining:
        analytics.budgetRemaining,

      budgetUsage:
        analytics.budgetUsage,

      budgetOverspending:
        analytics.budgetOverspending,

    };


    if (section in numericSections) {

      const numberValue = Number(value);

      if (Number.isFinite(numberValue)) {

        numericSections[section][key] =
          numberValue;

      }

      return;
    }


    // ========================================
    // BASIC ANALYTICS
    // ========================================

    switch (key) {

      case "TOTAL_INCOME":

        analytics.totalIncome = Number(value);

        break;


      case "TOTAL_EXPENSES":

        analytics.totalExpenses = Number(value);

        break;


      case "BALANCE":

        analytics.balance = Number(value);

        break;


      case "SAVINGS_RATE":

        analytics.savingsRate = Number(value);

        break;


      case "AVERAGE_EXPENSE":

        analytics.averageExpense = Number(value);

        break;


      case "TOP_CATEGORY":

        analytics.topCategory = value;

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