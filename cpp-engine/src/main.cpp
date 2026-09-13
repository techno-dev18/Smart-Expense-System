#include "../include/Analytics.h"

#include <iostream>
#include <vector>
#include <sstream>
#include <string>

using namespace std;


// ==========================================
// MAIN
// ==========================================

int main() {

    vector<Transaction> transactions;

    vector<Budget> budgets;

    string line;


    // ==========================================
    // READ INPUT FROM NODE.JS
    // ==========================================

    while (getline(cin, line)) {

        // Ignore empty lines
        if (line.empty()) {
            continue;
        }


        stringstream ss(line);

        string type;


        // --------------------------------------
        // Read record type
        // --------------------------------------

        getline(ss, type, '|');


        // ======================================
        // INCOME / EXPENSE
        // ======================================

        if (
            type == "income" ||
            type == "expense"
        ) {

            Transaction transaction;

            transaction.type = type;

            string amount;


            // ----------------------------------
            // Category
            // ----------------------------------

            if (
                !getline(
                    ss,
                    transaction.category,
                    '|'
                )
            ) {
                continue;
            }


            // ----------------------------------
            // Amount
            // ----------------------------------

            if (
                !getline(
                    ss,
                    amount,
                    '|'
                )
            ) {
                continue;
            }


            // ----------------------------------
            // Date
            // ----------------------------------

            if (
                !getline(
                    ss,
                    transaction.date,
                    '|'
                )
            ) {
                continue;
            }


            // ----------------------------------
            // Convert amount
            // ----------------------------------

            try {

                transaction.amount =
                    stod(amount);

            }
            catch (...) {

                continue;
            }


            // ----------------------------------
            // Store transaction
            // ----------------------------------

            transactions.push_back(
                transaction
            );
        }


        // ======================================
        // BUDGET
        // ======================================

        else if (type == "budget") {

            Budget budget;

            string amount;


            // ----------------------------------
            // Category
            // ----------------------------------

            if (
                !getline(
                    ss,
                    budget.category,
                    '|'
                )
            ) {
                continue;
            }


            // ----------------------------------
            // Amount
            // ----------------------------------

            if (
                !getline(
                    ss,
                    amount,
                    '|'
                )
            ) {
                continue;
            }


            // ----------------------------------
            // Month
            // ----------------------------------

            if (
                !getline(
                    ss,
                    budget.month,
                    '|'
                )
            ) {
                continue;
            }


            // ----------------------------------
            // Convert amount
            // ----------------------------------

            try {

                budget.amount =
                    stod(amount);

            }
            catch (...) {

                continue;
            }


            // ----------------------------------
            // Store budget
            // ----------------------------------

            budgets.push_back(
                budget
            );
        }
    }


    // ==========================================
    // CREATE ANALYTICS OBJECT
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


    for (
        const auto& item :
        categorySpending
    ) {

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


    for (
        const auto& item :
        monthlyExpenses
    ) {

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


    for (
        const auto& item :
        monthlyIncome
    ) {

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


    for (
        const auto& item :
        monthlyBalance
    ) {

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


    for (
        const auto& item :
        budgetActual
    ) {

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


    for (
        const auto& item :
        budgetRemaining
    ) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // BUDGET USAGE %
    // ==========================================

    cout
        << "BUDGET_USAGE="
        << endl;


    auto budgetUsage =
        analytics.getBudgetUsagePercentage();


    for (
        const auto& item :
        budgetUsage
    ) {

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


    for (
        const auto& item :
        budgetOverspending
    ) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // BUDGET SPENDING PACE
    // ==========================================

    cout
        << "BUDGET_PACE="
        << endl;


    auto budgetPace =
        analytics.getBudgetSpendingPace();


    for (
        const auto& item :
        budgetPace
    ) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // PROJECTED SPENDING
    // ==========================================

    cout
        << "BUDGET_PROJECTED="
        << endl;


    auto budgetProjected =
        analytics.getBudgetProjectedSpending();


    for (
        const auto& item :
        budgetProjected
    ) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // PROJECTED OVERSPENDING
    // ==========================================

    cout
        << "BUDGET_PROJECTED_OVERSPENDING="
        << endl;


    auto projectedOverspending =
        analytics.getBudgetProjectedOverspending();


    for (
        const auto& item :
        projectedOverspending
    ) {

        cout
            << item.first
            << "="
            << item.second
            << endl;
    }


    // ==========================================
    // BUDGET INSIGHTS
    // ==========================================

    cout
        << "BUDGET_INSIGHTS="
        << endl;


    auto budgetInsights =
        analytics.getBudgetInsights();


    for (
        const auto& insight :
        budgetInsights
    ) {

        cout
            << insight
            << endl;
    }


    // ==========================================
    // BUDGET RECOMMENDATIONS
    // ==========================================

    cout
        << "BUDGET_RECOMMENDATIONS="
        << endl;


    auto recommendations =
        analytics.getBudgetRecommendations();


    for (
        const auto& recommendation :
        recommendations
    ) {

        /*
         * Recommendations are already returned
         * from Analytics.cpp in this format:
         *
         * Category|YYYY-MM=Recommendation
         *
         * Example:
         *
         * Food|2026-09=Reduce Food spending...
         */

        cout
            << recommendation
            << endl;
    }


    // ==========================================
    // PROGRAM SUCCESS
    // ==========================================

    return 0;
}