#ifndef ANALYTICS_H
#define ANALYTICS_H

#include <string>
#include <vector>
#include <map>

struct Transaction {
    std::string type;
    std::string category;
    double amount;
    std::string date;
};

class Analytics {
private:
    std::vector<Transaction> transactions;

public:
    Analytics(
        const std::vector<Transaction>& transactions
    );

    double getTotalIncome() const;

    double getTotalExpenses() const;

    double getBalance() const;

    double getSavingsRate() const;

    double getAverageExpense() const;

    std::map<std::string, double>
    getCategorySpending() const;

    std::string getTopSpendingCategory() const;
};

#endif