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

    // Improve C++ input/output performance
    ios::sync_with_stdio(false);
    cin.tie(nullptr);


    vector<Transaction> transactions;
    vector<Budget> budgets;

    string line;


    // ==========================================
    // READ INPUT FROM NODE.JS
    // ==========================================

    while (getline(cin, line)) {

        if (line.empty()) {
            continue;
        }

        stringstream ss(line);
        string type;

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


            if (
                !getline(
                    ss,
                    transaction.category,
                    '|'
                )
            ) {
                continue;
            }


            if (
                !getline(
                    ss,
                    amount,
                    '|'
                )
            ) {
                continue;
            }


            if (
                !getline(
                    ss,
                    transaction.date,
                    '|'
                )
            ) {
                continue;
            }


            try {

                transaction.amount = stod(amount);

            }
            catch (...) {

                continue;

            }


            transactions.emplace_back(
                move(transaction)
            );

        }


        // ======================================
        // BUDGET
        // ======================================

        else if (type == "budget") {

            Budget budget;
            string amount;


            if (
                !getline(
                    ss,
                    budget.category,
                    '|'
                )
            ) {
                continue;
            }


            if (
                !getline(
                    ss,
                    amount,
                    '|'
                )
            ) {
                continue;
            }


            if (
                !getline(
                    ss,
                    budget.month,
                    '|'
                )
            ) {
                continue;
            }


            try {

                budget.amount = stod(amount);

            }
            catch (...) {

                continue;

            }


            budgets.emplace_back(
                move(budget)
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

    cout << "TOTAL_INCOME="
         << analytics.getTotalIncome()
         << '\n';

    cout << "TOTAL_EXPENSES="
         << analytics.getTotalExpenses()
         << '\n';

    cout << "BALANCE="
         << analytics.getBalance()
         << '\n';

    cout << "SAVINGS_RATE="
         << analytics.getSavingsRate()
         << '\n';

    cout << "AVERAGE_EXPENSE="
         << analytics.getAverageExpense()
         << '\n';

    cout << "TOP_CATEGORY="
         << analytics.getTopSpendingCategory()
         << '\n';


    // ==========================================
    // CATEGORY SPENDING
    // ==========================================

    cout << "CATEGORY_SPENDING=\n";

    const auto categorySpending =
        analytics.getCategorySpending();

    for (const auto& item : categorySpending) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // MONTHLY EXPENSES
    // ==========================================

    cout << "MONTHLY_EXPENSES=\n";

    const auto monthlyExpenses =
        analytics.getMonthlyExpenses();

    for (const auto& item : monthlyExpenses) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // MONTHLY INCOME
    // ==========================================

    cout << "MONTHLY_INCOME=\n";

    const auto monthlyIncome =
        analytics.getMonthlyIncome();

    for (const auto& item : monthlyIncome) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // MONTHLY BALANCE
    // ==========================================

    cout << "MONTHLY_BALANCE=\n";

    const auto monthlyBalance =
        analytics.getMonthlyBalance();

    for (const auto& item : monthlyBalance) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // BUDGET ACTUAL SPENDING
    // ==========================================

    cout << "BUDGET_ACTUAL=\n";

    const auto budgetActual =
        analytics.getBudgetActualSpending();

    for (const auto& item : budgetActual) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // BUDGET REMAINING
    // ==========================================

    cout << "BUDGET_REMAINING=\n";

    const auto budgetRemaining =
        analytics.getBudgetRemaining();

    for (const auto& item : budgetRemaining) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // BUDGET USAGE
    // ==========================================

    cout << "BUDGET_USAGE=\n";

    const auto budgetUsage =
        analytics.getBudgetUsagePercentage();

    for (const auto& item : budgetUsage) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // BUDGET OVERSPENDING
    // ==========================================

    cout << "BUDGET_OVERSPENDING=\n";

    const auto budgetOverspending =
        analytics.getBudgetOverspending();

    for (const auto& item : budgetOverspending) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // BUDGET PACE
    // ==========================================

    cout << "BUDGET_PACE=\n";

    const auto budgetPace =
        analytics.getBudgetSpendingPace();

    for (const auto& item : budgetPace) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // PROJECTED SPENDING
    // ==========================================

    cout << "BUDGET_PROJECTED=\n";

    const auto budgetProjected =
        analytics.getBudgetProjectedSpending();

    for (const auto& item : budgetProjected) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // PROJECTED OVERSPENDING
    // ==========================================

    cout << "BUDGET_PROJECTED_OVERSPENDING=\n";

    const auto projectedOverspending =
        analytics.getBudgetProjectedOverspending();

    for (const auto& item : projectedOverspending) {

        cout << item.first
             << '='
             << item.second
             << '\n';

    }


    // ==========================================
    // BUDGET INSIGHTS
    // ==========================================

    cout << "BUDGET_INSIGHTS=\n";

    const auto budgetInsights =
        analytics.getBudgetInsights();

    for (const auto& insight : budgetInsights) {

        cout << insight << '\n';

    }


    // ==========================================
    // BUDGET RECOMMENDATIONS
    // ==========================================

    cout << "BUDGET_RECOMMENDATIONS=\n";

    const auto recommendations =
        analytics.getBudgetRecommendations();

    for (const auto& recommendation : recommendations) {

        cout << recommendation << '\n';

    }


    // ==========================================
    // PROGRAM SUCCESS
    // ==========================================

    return 0;

}