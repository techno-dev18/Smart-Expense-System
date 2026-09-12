#include "../include/Analytics.h"

#include <limits>


Analytics::Analytics(
    const std::vector<Transaction>& transactions
) {
    this->transactions = transactions;
}


// Total Income
double Analytics::getTotalIncome() const {
    double total = 0.0;

    for (const auto& transaction : transactions) {
        if (transaction.type == "income") {
            total += transaction.amount;
        }
    }

    return total;
}


// Total Expenses
double Analytics::getTotalExpenses() const {
    double total = 0.0;

    for (const auto& transaction : transactions) {
        if (transaction.type == "expense") {
            total += transaction.amount;
        }
    }

    return total;
}


// Balance
double Analytics::getBalance() const {
    return getTotalIncome() - getTotalExpenses();
}


// Savings Rate
double Analytics::getSavingsRate() const {
    double income = getTotalIncome();
    double balance = getBalance();

    if (income <= 0) {
        return 0.0;
    }

    return (balance / income) * 100.0;
}


// Average Expense
double Analytics::getAverageExpense() const {
    double totalExpenses = getTotalExpenses();

    int expenseCount = 0;

    for (const auto& transaction : transactions) {
        if (transaction.type == "expense") {
            expenseCount++;
        }
    }

    if (expenseCount == 0) {
        return 0.0;
    }

    return totalExpenses / expenseCount;
}


// Category Spending
std::map<std::string, double>
Analytics::getCategorySpending() const {

    std::map<std::string, double> categorySpending;

    for (const auto& transaction : transactions) {

        if (transaction.type == "expense") {

            categorySpending[
                transaction.category
            ] += transaction.amount;
        }
    }

    return categorySpending;
}


// Top Spending Category
std::string
Analytics::getTopSpendingCategory() const {

    std::map<std::string, double>
        categorySpending =
            getCategorySpending();

    std::string topCategory = "";

    double highestAmount =
        std::numeric_limits<double>::lowest();

    for (const auto& item : categorySpending) {

        if (item.second > highestAmount) {

            highestAmount = item.second;

            topCategory = item.first;
        }
    }

    return topCategory;
}