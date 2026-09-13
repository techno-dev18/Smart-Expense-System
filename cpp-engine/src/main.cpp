#include "../include/Analytics.h"

#include <iostream>
#include <vector>
#include <sstream>
#include <string>

using namespace std;

int main() {

    vector<Transaction> transactions;
    vector<Budget> budgets;

    string line;

    // ==========================================
    // READ INPUT
    // ==========================================

    while (getline(cin, line)) {

        if (line.empty()) {
            continue;
        }

        stringstream ss(line);

        string type;

        getline(ss, type, '|');


        // ==========================================
        // TRANSACTION
        // ==========================================

        if (type == "income" || type == "expense") {

            Transaction transaction;

            transaction.type = type;

            string amount;

            getline(
                ss,
                transaction.category,
                '|'
            );

            getline(
                ss,
                amount,
                '|'
            );

            getline(
                ss,
                transaction.date,
                '|'
            );

            try {

                transaction.amount = stod(amount);

            }
            catch (...) {

                continue;
            }

            transactions.push_back(transaction);
        }


        // ==========================================
        // BUDGET
        // ==========================================

        else if (type == "budget") {

            Budget budget;

            string amount;

            getline(
                ss,
                budget.category,
                '|'
            );

            getline(
                ss,
                amount,
                '|'
            );

            getline(
                ss,
                budget.month,
                '|'
            );

            try {

                budget.amount = stod(amount);

            }
            catch (...) {

                continue;
            }

            budgets.push_back(budget);
        }
    }


    // ==========================================
    // CREATE ANALYTICS ENGINE
    // ==========================================

    Analytics analytics(
        transactions,
        budgets
    );


    // ==========================================
    // BASIC ANALYTICS
    // ==========================================

    cout
        << "TOTAL_INCOME="
        << analytics.getTotalIncome()
        << endl;

    cout
        << "TOTAL_EXPENSES="
        << analytics.getTotalExpenses()
        << endl;

    cout
        << "BALANCE="
        << analytics.getBalance()
        << endl;

    cout
        << "SAVINGS_RATE="
        << analytics.getSavingsRate()
        << endl;

    cout
        << "AVERAGE_EXPENSE="
        << analytics.getAverageExpense()
        << endl;


    // ==========================================
    // TOP SPENDING CATEGORY
    // ==========================================

    cout
        << "TOP_CATEGORY="
        << analytics.getTopSpendingCategory()
        << endl;


    // ==========================================
    // CATEGORY SPENDING
    // ==========================================

    cout
        << "CATEGORY_SPENDING="
        << endl;

    auto categorySpending =
        analytics.getCategorySpending();

    for (const auto& item : categorySpending) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // MONTHLY EXPENSES
    // ==========================================

    cout
        << "MONTHLY_EXPENSES="
        << endl;

    auto monthlyExpenses =
        analytics.getMonthlyExpenses();

    for (const auto& item : monthlyExpenses) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // MONTHLY INCOME
    // ==========================================

    cout
        << "MONTHLY_INCOME="
        << endl;

    auto monthlyIncome =
        analytics.getMonthlyIncome();

    for (const auto& item : monthlyIncome) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // MONTHLY BALANCE
    // ==========================================

    cout
        << "MONTHLY_BALANCE="
        << endl;

    auto monthlyBalance =
        analytics.getMonthlyBalance();

    for (const auto& item : monthlyBalance) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // BUDGET ACTUAL SPENDING
    // ==========================================

    cout
        << "BUDGET_ACTUAL="
        << endl;

    auto budgetActual =
        analytics.getBudgetActualSpending();

    for (const auto& item : budgetActual) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // BUDGET REMAINING
    // ==========================================

    cout
        << "BUDGET_REMAINING="
        << endl;

    auto budgetRemaining =
        analytics.getBudgetRemaining();

    for (const auto& item : budgetRemaining) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // BUDGET USAGE PERCENTAGE
    // ==========================================

    cout
        << "BUDGET_USAGE="
        << endl;

    auto budgetUsage =
        analytics.getBudgetUsagePercentage();

    for (const auto& item : budgetUsage) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // BUDGET OVERSPENDING
    // ==========================================

    cout
        << "BUDGET_OVERSPENDING="
        << endl;

    auto budgetOverspending =
        analytics.getBudgetOverspending();

    for (const auto& item : budgetOverspending) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }
// ==========================================
// SMART BUDGET INSIGHTS
// ==========================================

cout
    << "BUDGET_INSIGHTS="
    << endl;

auto budgetInsights =
    analytics.getBudgetInsights();

for (const auto& insight : budgetInsights) {

    cout
        << insight
        << endl;
}

    // ==========================================
    // PROGRAM COMPLETE
    // ==========================================

    return 0;
}