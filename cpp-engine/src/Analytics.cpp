#include "../include/Analytics.h"

#include <ctime>
#include <limits>
#include <stdexcept>

using namespace std;


// ==========================================
// HELPER FUNCTIONS
// ==========================================

int getCurrentDay() {

    time_t currentTime = time(nullptr);

    tm* currentDate = localtime(&currentTime);

    if (currentDate == nullptr) {
        return 1;
    }

    return currentDate->tm_mday;
}


string getCurrentMonth() {

    time_t currentTime = time(nullptr);

    tm* currentDate = localtime(&currentTime);

    if (currentDate == nullptr) {
        return "";
    }

    int year =
        currentDate->tm_year + 1900;

    int month =
        currentDate->tm_mon + 1;

    string result =
        to_string(year) + "-";

    if (month < 10) {
        result += "0";
    }

    result += to_string(month);

    return result;
}


int getDaysInMonth(
    const string& month
) {

    if (month.length() < 7) {
        return 30;
    }

    try {

        int year =
            stoi(month.substr(0, 4));

        int monthNumber =
            stoi(month.substr(5, 2));


        // February

        if (monthNumber == 2) {

            bool leapYear =
                (year % 400 == 0) ||
                (
                    year % 4 == 0 &&
                    year % 100 != 0
                );

            return leapYear ? 29 : 28;
        }


        // 30-day months

        if (
            monthNumber == 4 ||
            monthNumber == 6 ||
            monthNumber == 9 ||
            monthNumber == 11
        ) {

            return 30;
        }


        // 31-day months

        return 31;

    }
    catch (...) {

        return 30;
    }
}


// ==========================================
// CONSTRUCTOR
// ==========================================

Analytics::Analytics(
    const vector<Transaction>& transactions,
    const vector<Budget>& budgets
) {

    this->transactions =
        transactions;

    this->budgets =
        budgets;
}


// ==========================================
// TOTAL INCOME
// ==========================================

double Analytics::getTotalIncome() const {

    double total = 0.0;

    for (const auto& transaction : transactions) {

        if (transaction.type == "income") {

            total += transaction.amount;
        }
    }

    return total;
}


// ==========================================
// TOTAL EXPENSES
// ==========================================

double Analytics::getTotalExpenses() const {

    double total = 0.0;

    for (const auto& transaction : transactions) {

        if (transaction.type == "expense") {

            total += transaction.amount;
        }
    }

    return total;
}


// ==========================================
// BALANCE
// ==========================================

double Analytics::getBalance() const {

    return
        getTotalIncome() -
        getTotalExpenses();
}


// ==========================================
// SAVINGS RATE
// ==========================================

double Analytics::getSavingsRate() const {

    double income =
        getTotalIncome();

    double balance =
        getBalance();

    if (income <= 0) {

        return 0.0;
    }

    return
        (balance / income) *
        100.0;
}


// ==========================================
// AVERAGE EXPENSE
// ==========================================

double Analytics::getAverageExpense() const {

    double totalExpenses =
        getTotalExpenses();

    int expenseCount = 0;

    for (const auto& transaction : transactions) {

        if (transaction.type == "expense") {

            expenseCount++;
        }
    }

    if (expenseCount == 0) {

        return 0.0;
    }

    return
        totalExpenses /
        expenseCount;
}


// ==========================================
// CATEGORY SPENDING
// ==========================================

map<string, double>
Analytics::getCategorySpending() const {

    map<string, double>
        categorySpending;

    for (const auto& transaction : transactions) {

        if (transaction.type == "expense") {

            categorySpending[
                transaction.category
            ] += transaction.amount;
        }
    }

    return categorySpending;
}


// ==========================================
// TOP SPENDING CATEGORY
// ==========================================

string
Analytics::getTopSpendingCategory() const {

    auto categorySpending =
        getCategorySpending();

    string topCategory = "";

    double highestAmount =
        numeric_limits<double>::lowest();

    for (const auto& item :
         categorySpending) {

        if (item.second > highestAmount) {

            highestAmount =
                item.second;

            topCategory =
                item.first;
        }
    }

    return topCategory;
}


// ==========================================
// MONTHLY EXPENSES
// ==========================================

map<string, double>
Analytics::getMonthlyExpenses() const {

    map<string, double>
        monthlyExpenses;

    for (const auto& transaction :
         transactions) {

        if (
            transaction.type == "expense" &&
            transaction.date.length() >= 7
        ) {

            string month =
                transaction.date.substr(0, 7);

            monthlyExpenses[month] +=
                transaction.amount;
        }
    }

    return monthlyExpenses;
}


// ==========================================
// MONTHLY INCOME
// ==========================================

map<string, double>
Analytics::getMonthlyIncome() const {

    map<string, double>
        monthlyIncome;

    for (const auto& transaction :
         transactions) {

        if (
            transaction.type == "income" &&
            transaction.date.length() >= 7
        ) {

            string month =
                transaction.date.substr(0, 7);

            monthlyIncome[month] +=
                transaction.amount;
        }
    }

    return monthlyIncome;
}


// ==========================================
// MONTHLY BALANCE
// ==========================================

map<string, double>
Analytics::getMonthlyBalance() const {

    auto monthlyIncome =
        getMonthlyIncome();

    auto monthlyExpenses =
        getMonthlyExpenses();

    map<string, double>
        monthlyBalance;


    for (const auto& item :
         monthlyIncome) {

        monthlyBalance[item.first] +=
            item.second;
    }


    for (const auto& item :
         monthlyExpenses) {

        monthlyBalance[item.first] -=
            item.second;
    }

    return monthlyBalance;
}


// ==========================================
// BUDGET ACTUAL SPENDING
// ==========================================

map<string, double>
Analytics::getBudgetActualSpending() const {

    map<string, double>
        actualSpending;


    for (const auto& budget : budgets) {

        double total = 0.0;


        for (const auto& transaction :
             transactions) {

            if (
                transaction.type == "expense" &&
                transaction.category ==
                    budget.category &&
                transaction.date.length() >= 7 &&
                transaction.date.substr(0, 7) ==
                    budget.month
            ) {

                total +=
                    transaction.amount;
            }
        }


        string key =
            budget.category +
            "|" +
            budget.month;


        actualSpending[key] =
            total;
    }


    return actualSpending;
}


// ==========================================
// BUDGET REMAINING
// ==========================================

map<string, double>
Analytics::getBudgetRemaining() const {

    map<string, double>
        remaining;

    auto actualSpending =
        getBudgetActualSpending();


    for (const auto& budget : budgets) {

        string key =
            budget.category +
            "|" +
            budget.month;

        double actual =
            actualSpending[key];


        remaining[key] =
            budget.amount -
            actual;
    }


    return remaining;
}


// ==========================================
// BUDGET USAGE %
// ==========================================

map<string, double>
Analytics::getBudgetUsagePercentage() const {

    map<string, double>
        usage;

    auto actualSpending =
        getBudgetActualSpending();


    for (const auto& budget : budgets) {

        string key =
            budget.category +
            "|" +
            budget.month;

        double actual =
            actualSpending[key];


        if (budget.amount <= 0) {

            usage[key] =
                0.0;
        }

        else {

            usage[key] =
                (
                    actual /
                    budget.amount
                ) *
                100.0;
        }
    }


    return usage;
}


// ==========================================
// BUDGET OVERSPENDING
// ==========================================

map<string, double>
Analytics::getBudgetOverspending() const {

    map<string, double>
        overspending;

    auto actualSpending =
        getBudgetActualSpending();


    for (const auto& budget : budgets) {

        string key =
            budget.category +
            "|" +
            budget.month;

        double actual =
            actualSpending[key];


        if (actual > budget.amount) {

            overspending[key] =
                actual -
                budget.amount;
        }

        else {

            overspending[key] =
                0.0;
        }
    }


    return overspending;
}


// ==========================================
// BUDGET SPENDING PACE
// ==========================================

map<string, double>
Analytics::getBudgetSpendingPace() const {

    map<string, double>
        pace;

    auto actualSpending =
        getBudgetActualSpending();

    string currentMonth =
        getCurrentMonth();

    int currentDay =
        getCurrentDay();


    if (currentDay <= 0) {

        currentDay = 1;
    }


    for (const auto& budget : budgets) {

        string key =
            budget.category +
            "|" +
            budget.month;


        double actual =
            actualSpending[key];


        int daysInMonth =
            getDaysInMonth(
                budget.month
            );


        // Future budget

        if (budget.month > currentMonth) {

            pace[key] =
                0.0;

            continue;
        }


        // Completed month

        if (budget.month < currentMonth) {

            pace[key] =
                100.0;

            continue;
        }


        // Current month

        double expectedPercentage =
            (
                static_cast<double>(
                    currentDay
                ) /
                daysInMonth
            ) *
            100.0;


        double actualPercentage =
            0.0;


        if (budget.amount > 0) {

            actualPercentage =
                (
                    actual /
                    budget.amount
                ) *
                100.0;
        }


        if (expectedPercentage > 0) {

            pace[key] =
                (
                    actualPercentage /
                    expectedPercentage
                ) *
                100.0;
        }

        else {

            pace[key] =
                0.0;
        }
    }


    return pace;
}


// ==========================================
// PROJECTED SPENDING
// ==========================================

map<string, double>
Analytics::getBudgetProjectedSpending() const {

    map<string, double>
        projected;

    auto actualSpending =
        getBudgetActualSpending();

    string currentMonth =
        getCurrentMonth();

    int currentDay =
        getCurrentDay();


    if (currentDay <= 0) {

        currentDay = 1;
    }


    for (const auto& budget : budgets) {

        string key =
            budget.category +
            "|" +
            budget.month;


        double actual =
            actualSpending[key];


        int daysInMonth =
            getDaysInMonth(
                budget.month
            );


        // Future month

        if (budget.month > currentMonth) {

            projected[key] =
                0.0;

            continue;
        }


        // Previous completed month

        if (budget.month < currentMonth) {

            projected[key] =
                actual;

            continue;
        }


        // Current month

        double dailyAverage =
            actual /
            currentDay;


        projected[key] =
            dailyAverage *
            daysInMonth;
    }


    return projected;
}


// ==========================================
// PROJECTED OVERSPENDING
// ==========================================

map<string, double>
Analytics::getBudgetProjectedOverspending() const {

    map<string, double>
        projectedOverspending;

    auto projected =
        getBudgetProjectedSpending();


    for (const auto& budget : budgets) {

        string key =
            budget.category +
            "|" +
            budget.month;


        double projectedAmount =
            projected[key];


        double overspending =
            projectedAmount -
            budget.amount;


        if (overspending < 0) {

            overspending =
                0.0;
        }


        projectedOverspending[key] =
            overspending;
    }


    return projectedOverspending;
}


// ==========================================
// SMART BUDGET INSIGHTS
// ==========================================

vector<string>
Analytics::getBudgetInsights() const {

    vector<string>
        insights;


    auto actualSpending =
        getBudgetActualSpending();

    auto usage =
        getBudgetUsagePercentage();

    auto overspending =
        getBudgetOverspending();


    for (const auto& budget : budgets) {

        string key =
            budget.category +
            "|" +
            budget.month;


        double actual =
            actualSpending[key];

        double percentage =
            usage[key];

        double overspent =
            overspending[key];


        // ======================================
        // OVERSPENDING
        // ======================================

        if (overspent > 0) {

            insights.push_back(
                "You have overspent your " +
                budget.category +
                " budget by Rs. " +
                to_string(overspent)
            );
        }


        // ======================================
        // 90% OR MORE
        // ======================================

        else if (percentage >= 90) {

            double remaining =
                budget.amount -
                actual;


            insights.push_back(
                "Warning: You have used " +
                to_string(percentage) +
                "% of your " +
                budget.category +
                " budget. Only Rs. " +
                to_string(remaining) +
                " remains."
            );
        }


        // ======================================
        // 70% - 89%
        // ======================================

        else if (percentage >= 70) {

            insights.push_back(
                "Watch your " +
                budget.category +
                " spending. You have used " +
                to_string(percentage) +
                "% of your budget."
            );
        }


        // ======================================
        // BELOW 70%
        // ======================================

        else {

            double remaining =
                budget.amount -
                actual;


            insights.push_back(
                "Your " +
                budget.category +
                " spending is within budget. Rs. " +
                to_string(remaining) +
                " remains."
            );
        }
    }


    return insights;
}


// ==========================================
// SMART BUDGET RECOMMENDATIONS
// ==========================================

vector<string>
Analytics::getBudgetRecommendations() const {

    vector<string>
        recommendations;


    auto projected =
        getBudgetProjectedSpending();

    auto projectedOverspending =
        getBudgetProjectedOverspending();

    auto actual =
        getBudgetActualSpending();

    auto pace =
        getBudgetSpendingPace();


    string currentMonth =
        getCurrentMonth();


    for (const auto& budget : budgets) {

        string key =
            budget.category +
            "|" +
            budget.month;


        double spent =
            actual[key];

        double projectedAmount =
            projected[key];

        double projectedOver =
            projectedOverspending[key];

        double spendingPace =
            pace[key];


        // ======================================
        // PROJECTED OVERSPENDING
        // ======================================

        if (
            budget.month == currentMonth &&
            projectedOver > 0
        ) {

            recommendations.push_back(
                "Reduce " +
                budget.category +
                " spending. Your current pace projects about Rs. " +
                to_string(projectedAmount) +
                " spending this month, which is Rs. " +
                to_string(projectedOver) +
                " above your budget."
            );

            continue;
        }


        // ======================================
        // VERY FAST SPENDING
        // ======================================

        if (
            budget.month == currentMonth &&
            spendingPace >= 120
        ) {

            recommendations.push_back(
                "Your " +
                budget.category +
                " spending is significantly ahead of pace. Try to slow down spending for the rest of the month."
            );

            continue;
        }


        // ======================================
        // SLIGHTLY FAST SPENDING
        // ======================================

        if (
            budget.month == currentMonth &&
            spendingPace >= 100
        ) {

            recommendations.push_back(
                "Monitor your " +
                budget.category +
                " spending. You are spending slightly faster than the expected monthly pace."
            );

            continue;
        }


        // ======================================
        // GOOD CONTROL
        // ======================================

        if (
            budget.amount > 0 &&
            spent <=
                budget.amount * 0.5
        ) {

            recommendations.push_back(
                "Good control on " +
                budget.category +
                " spending. You are currently well within your budget."
            );

            continue;
        }


        // ======================================
        // DEFAULT
        // ======================================

        recommendations.push_back(
            "Continue monitoring your " +
            budget.category +
            " spending to stay within your monthly budget."
        );
    }


    return recommendations;
}