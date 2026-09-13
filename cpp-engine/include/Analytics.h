#ifndef ANALYTICS_H
#define ANALYTICS_H

#include <string>
#include <vector>
#include <map>

using namespace std;


// ==========================================
// TRANSACTION STRUCT
// ==========================================

struct Transaction {

    string type;

    string category;

    double amount;

    string date;
};


// ==========================================
// BUDGET STRUCT
// ==========================================

struct Budget {

    string category;

    double amount;

    string month;
};


// ==========================================
// ANALYTICS CLASS
// ==========================================

class Analytics {

private:

    vector<Transaction> transactions;

    vector<Budget> budgets;


public:

    // ======================================
    // CONSTRUCTOR
    // ======================================

    Analytics(
        const vector<Transaction>& transactions,
        const vector<Budget>& budgets
    );


    // ======================================
    // BASIC FINANCIAL ANALYTICS
    // ======================================

    double getTotalIncome() const;

    double getTotalExpenses() const;

    double getBalance() const;

    double getSavingsRate() const;

    double getAverageExpense() const;


    // ======================================
    // CATEGORY ANALYTICS
    // ======================================

    map<string, double>
    getCategorySpending() const;

    string
    getTopSpendingCategory() const;


    // ======================================
    // MONTHLY ANALYTICS
    // ======================================

    map<string, double>
    getMonthlyExpenses() const;

    map<string, double>
    getMonthlyIncome() const;

    map<string, double>
    getMonthlyBalance() const;


    // ======================================
    // BASIC BUDGET ANALYTICS
    // ======================================

    map<string, double>
    getBudgetActualSpending() const;

    map<string, double>
    getBudgetRemaining() const;

    map<string, double>
    getBudgetUsagePercentage() const;

    map<string, double>
    getBudgetOverspending() const;


    // ======================================
    // BUDGET INTELLIGENCE
    // ======================================

    map<string, double>
    getBudgetSpendingPace() const;

    map<string, double>
    getBudgetProjectedSpending() const;

    map<string, double>
    getBudgetProjectedOverspending() const;


    // ======================================
    // BUDGET INSIGHTS
    // ======================================

    vector<string>
    getBudgetInsights() const;


    // ======================================
    // BUDGET RECOMMENDATIONS
    // ======================================

    vector<string>
    getBudgetRecommendations() const;
};


#endif