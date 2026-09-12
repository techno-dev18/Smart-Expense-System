#include "../include/Analytics.h"

#include <iostream>
#include <vector>
#include <sstream>
#include <string>

int main() {

    std::vector<Transaction> transactions;

    std::string line;

    /*
        Input format:

        type|category|amount|date

        Example:

        income|Salary|50000|2026-09-01
        expense|Food|5000|2026-09-02
    */

    while (std::getline(std::cin, line)) {

        if (line.empty()) {
            continue;
        }

        std::stringstream ss(line);

        Transaction transaction;

        std::string amount;

        std::getline(
            ss,
            transaction.type,
            '|'
        );

        std::getline(
            ss,
            transaction.category,
            '|'
        );

        std::getline(
            ss,
            amount,
            '|'
        );

        std::getline(
            ss,
            transaction.date,
            '|'
        );

        try {

            transaction.amount =
                std::stod(amount);

        } catch (...) {

            continue;
        }

        transactions.push_back(
            transaction
        );
    }


    Analytics analytics(transactions);


    double totalIncome =
        analytics.getTotalIncome();

    double totalExpenses =
        analytics.getTotalExpenses();

    double balance =
        analytics.getBalance();

    double savingsRate =
        analytics.getSavingsRate();

    double averageExpense =
        analytics.getAverageExpense();

    std::string topCategory =
        analytics.getTopSpendingCategory();


    /*
        Output is deliberately structured
        so Node.js can easily parse it.
    */

    std::cout
        << "TOTAL_INCOME="
        << totalIncome
        << std::endl;

    std::cout
        << "TOTAL_EXPENSES="
        << totalExpenses
        << std::endl;

    std::cout
        << "BALANCE="
        << balance
        << std::endl;

    std::cout
        << "SAVINGS_RATE="
        << savingsRate
        << std::endl;

    std::cout
        << "AVERAGE_EXPENSE="
        << averageExpense
        << std::endl;

    std::cout
        << "TOP_CATEGORY="
        << topCategory
        << std::endl;


    std::cout
        << "CATEGORY_SPENDING="
        << std::endl;


    auto categorySpending =
        analytics.getCategorySpending();


    for (const auto& item :
         categorySpending) {

        std::cout
            << item.first
            << "="
            << item.second
            << std::endl;
    }


    return 0;
}