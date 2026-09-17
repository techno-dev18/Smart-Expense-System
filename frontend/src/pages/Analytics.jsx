import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { getAnalytics } from "../services/analyticsApi";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

import "../styles/analytics.css";

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  // ==========================================
  // LOAD ANALYTICS
  // ==========================================

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAnalytics();

      setAnalytics(response.analytics || null);
    } catch (err) {
      console.error(
        "Analytics loading error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadAnalytics();

    const handleFocus = () => {
      loadAnalytics();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="analytics-page">
        <Loading message="Loading analytics..." />
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error && !analytics) {
    return (
      <div className="analytics-page">
        <ErrorState
          title="Unable to load analytics"
          message={error}
          actionText="Try Again"
          onAction={loadAnalytics}
        />
      </div>
    );
  }

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!analytics) {
    return (
      <div className="analytics-page">
        <EmptyState
          title="No analytics available"
          message="Add income or expenses to generate analytics."
          actionText="Refresh Analytics"
          onAction={loadAnalytics}
        />
      </div>
    );
  }

  // ==========================================
  // ANALYTICS DATA
  // ==========================================

  const categorySpending = analytics.categorySpending || {};

  const monthlyExpenses = analytics.monthlyExpenses || {};

  const monthlyIncome = analytics.monthlyIncome || {};

  const budgetInsights = analytics.budgetInsights || [];

  const budgetUsage = analytics.budgetUsage || {};

  const budgetRemaining = analytics.budgetRemaining || {};

  const categoryEntries = Object.entries(categorySpending);

  const expenseEntries = Object.entries(monthlyExpenses).sort(
    ([monthA], [monthB]) => monthA.localeCompare(monthB)
  );

  const incomeEntries = Object.entries(monthlyIncome).sort(
    ([monthA], [monthB]) => monthA.localeCompare(monthB)
  );

  const budgetEntries = Object.entries(budgetUsage);

  // ==========================================
  // PIE CHART DATA
  // ==========================================

  const categoryChartData = categoryEntries
    .map(([category, amount]) => ({
      name: category,
      value: Number(amount),
    }))
    .filter(
      (item) =>
        item.name &&
        Number.isFinite(item.value) &&
        item.value > 0
    );

  // ==========================================
  // BAR CHART DATA
  // ==========================================

  const monthlyChartData = Array.from(
    new Set([
      ...Object.keys(monthlyExpenses),
      ...Object.keys(monthlyIncome),
    ])
  )
    .sort()
    .map((month) => ({
      month,
      income: Number(monthlyIncome[month] || 0),
      expenses: Number(monthlyExpenses[month] || 0),
    }));

  // ==========================================
  // SAVINGS PROGRESS
  // ==========================================

  const savingsTarget = 20;

  const currentSavingsRate = Number(
    analytics?.savingsRate || 0
  );

  const savingsProgress = Math.min(
    Math.max(
      (currentSavingsRate / savingsTarget) * 100,
      0
    ),
    100
  );

  const savingsMessage =
    currentSavingsRate >= savingsTarget
      ? "You are meeting your savings target."
      : "Try to increase your monthly savings.";
  // ==========================================
  // FINANCIAL HEALTH SCORE
  // ==========================================

  const totalIncome = Number(analytics.totalIncome || 0);

  const totalExpenses = Number(analytics.totalExpenses || 0);

  const balance = Number(analytics.balance || 0);

  const savingsRate = Number(analytics.savingsRate || 0);

  let financialHealthScore = 0;

  if (totalIncome > 0) {
    financialHealthScore += Math.min(
      Math.max(savingsRate * 2, 0),
      40
    );

    if (balance > 0) {
      financialHealthScore += 30;
    }

    if (totalExpenses < totalIncome) {
      financialHealthScore += 30;
    }
  }

  financialHealthScore = Math.round(
    Math.min(Math.max(financialHealthScore, 0), 100)
  );

  const financialHealthMessage =
    financialHealthScore >= 80
      ? "Excellent financial health"
      : financialHealthScore >= 60
      ? "Good financial health"
      : financialHealthScore >= 40
      ? "Needs improvement"
      : "Focus on improving your finances";
      // ==========================================
// EXPENSE-TO-INCOME RATIO
// ==========================================

const expenseToIncomeRatio =
  totalIncome > 0
    ? (totalExpenses / totalIncome) * 100
    : 0;

const expenseRatioMessage =
  expenseToIncomeRatio > 100
    ? "Your expenses are higher than your income."
    : expenseToIncomeRatio >= 80
    ? "A large portion of your income is being spent."
    : "Your expenses are within your income.";
    // ==========================================
// SAVINGS AMOUNT
// ==========================================

const savingsAmount = totalIncome - totalExpenses;

const savingsAmountMessage =
  savingsAmount > 0
    ? "You are saving money."
    : savingsAmount < 0
    ? "Your expenses exceed your income."
    : "Your income and expenses are equal.";
    // ==========================================
// MONTHLY SAVINGS
// ==========================================

const monthlySavingsData = monthlyChartData.map((item) => ({
  month: item.month,
  savings: item.income - item.expenses,
}));
  return (
    <div className="analytics-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="analytics-header">
        <div>
          <h1>Financial Analytics</h1>

          <p>
            Understand your income, expenses,
            spending patterns, and financial
            performance.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={loadAnalytics}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {/* ======================================
          INLINE ERROR
      ====================================== */}

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="analytics-summary-grid">

        <div className="analytics-summary-card">
          <span>Total Income</span>

          <strong>
            {formatCurrency(analytics.totalIncome)}
          </strong>
        </div>

        <div className="analytics-summary-card">
          <span>Total Expenses</span>

          <strong>
            {formatCurrency(analytics.totalExpenses)}
          </strong>
        </div>

        <div className="analytics-summary-card">
          <span>Balance</span>

          <strong
            className={
              Number(analytics.balance) < 0
                ? "negative"
                : "positive"
            }
          >
            {formatCurrency(analytics.balance)}
          </strong>
        </div>

        <div className="analytics-summary-card">
          <span>Savings Rate</span>

          <strong>
            {Number(analytics.savingsRate || 0).toFixed(1)}%
          </strong>
        </div>

      </div>

      {/* ======================================
          SAVINGS PROGRESS
      ====================================== */}

      <div className="savings-card">
        <div className="savings-header">
          <div>
            <h2>Savings Progress</h2>

            <p>
              Target savings rate: {savingsTarget}%
            </p>
          </div>

          <span className="savings-percentage">
            {currentSavingsRate.toFixed(2)}%
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${savingsProgress}%`,
            }}
          ></div>
        </div>

        <p className="savings-message">
          {savingsMessage}
        </p>
      </div>

      
{/* ======================================
    BUDGET SUMMARY
====================================== */}

<div className="budget-summary-grid">

  <div className="budget-summary-card">
    <span>Total Budgets</span>

    <strong>
      {budgetEntries.length}
    </strong>
  </div>

  <div className="budget-summary-card budget-summary-safe">
    <span>Safe Budgets</span>

    <strong>
      {
        budgetEntries.filter(
          ([, usage]) => Number(usage) < 80
        ).length
      }
    </strong>
  </div>

  <div className="budget-summary-card budget-summary-warning">
    <span>Warning Budgets</span>

    <strong>
      {
        budgetEntries.filter(
          ([, usage]) =>
            Number(usage) >= 80 &&
            Number(usage) < 100
        ).length
      }
    </strong>
  </div>

  <div className="budget-summary-card budget-summary-danger">
    <span>Exceeded Budgets</span>

    <strong>
      {
        budgetEntries.filter(
          ([, usage]) => Number(usage) >= 100
        ).length
      }
    </strong>
  </div>

</div>

{/* ======================================
    FINANCIAL HEALTH SCORE
====================================== */}

<div className="financial-health-card">

  <div className="financial-health-header">
    <div>
      <h2>Financial Health Score</h2>

      <p>
        Based on your income, expenses, balance,
        and savings rate.
      </p>
    </div>

    <strong className="financial-health-score">
      {financialHealthScore}/100
    </strong>
  </div>

  <div className="progress-track">
    <div
      className="progress-fill financial-health-fill"
      style={{
        width: `${financialHealthScore}%`,
      }}
    ></div>
  </div>

  <p className="financial-health-message">
    {financialHealthMessage}
  </p>

</div>
      {/* ======================================
          BUDGET OVERVIEW
      ====================================== */}

      <div className="analytics-section">
        <div className="section-heading">
          <h2>Budget Overview</h2>

          <p>
            Monitor your budget usage and remaining limits.
          </p>
        </div>

        {budgetEntries.length === 0 ? (
          <EmptyState
            title="No budget data"
            message="Create a budget to view budget progress."
          />
        ) : (
          <div className="budget-overview-list">
            {budgetEntries.map(([budgetKey, usage]) => {
              const [category, month] = budgetKey.split("|");

              const usagePercentage = Math.min(
                Math.max(Number(usage) || 0, 0),
                100
              );

              const remaining = Number(
                budgetRemaining[budgetKey] || 0
              );

              const statusClass =
                usagePercentage >= 100
                  ? "budget-danger"
                  : usagePercentage >= 80
                  ? "budget-warning"
                  : "budget-safe";

              const progressClass =
                usagePercentage >= 100
                  ? "budget-danger-fill"
                  : usagePercentage >= 80
                  ? "budget-warning-fill"
                  : "budget-safe-fill";

              return (
                <div
                  className="budget-overview-card"
                  key={budgetKey}
                >
                  <div className="budget-overview-header">
                    <div>
                      <h3>{category}</h3>

                      <p>{month}</p>
                    </div>

                    <strong className={statusClass}>
                      {usagePercentage.toFixed(1)}%
                    </strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className={`progress-fill ${progressClass}`}
                      style={{
                        width: `${usagePercentage}%`,
                      }}
                    ></div>
                  </div>

               <p className="budget-remaining">
  Remaining: {formatCurrency(remaining)}
</p>

<p
  className={
    usagePercentage >= 100
      ? "budget-status budget-status-danger"
      : usagePercentage >= 80
      ? "budget-status budget-status-warning"
      : "budget-status budget-status-safe"
  }
>
  {usagePercentage >= 100
    ? "⚠️ Budget exceeded"
    : usagePercentage >= 80
    ? "⚠️ Approaching budget limit"
    : "✅ Spending is under control"}
</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================
          SPENDING BY CATEGORY
      ====================================== */}

      <div className="analytics-section">
        <div className="section-heading">
          <h2>Spending by Category</h2>

          <p>
            See which categories consume
            the most of your money.
          </p>
        </div>

        {categoryEntries.length === 0 ? (
          <EmptyState
            title="No category data"
            message="Add expenses to view category spending."
          />
        ) : (
          <div className="analytics-category-list">
            {categoryEntries.map(([category, amount]) => {
              const percentage =
                Number(analytics.totalExpenses) > 0
                  ? (Number(amount) /
                      Number(analytics.totalExpenses)) *
                    100
                  : 0;

              return (
                <div
                  className="analytics-category-row"
                  key={category}
                >
                  <div className="analytics-category-info">
                    <span>{category}</span>

                    <strong>
                      {formatCurrency(amount)}
                    </strong>
                  </div>

                  <div className="analytics-category-track">
                    <div
                      className="analytics-category-fill"
                      style={{
                        width: `${Math.min(
                          Math.max(percentage, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <span className="analytics-category-percentage">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================
          SPENDING PIE CHART
      ====================================== */}

      <div className="chart-card">
        <h2>Category Spending</h2>

        {categoryChartData.length === 0 ? (
          <p className="no-data">
            No category spending data available.
          </p>
        ) : (
          <div className="chart-scroll">
            <PieChart width={550} height={420}>
              <Pie
                data={categoryChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={135}
                innerRadius={60}
                paddingAngle={2}
                label={({ name, percent }) =>
                  percent >= 0.05
                    ? `${name} ${(percent * 100).toFixed(0)}%`
                    : ""
                }
                isAnimationActive={false}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      CHART_COLORS[
                        index % CHART_COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Amount",
                ]}
              />

              <Legend />
            </PieChart>
          </div>
        )}
      </div>

      {/* ======================================
          MONTHLY EXPENSES
      ====================================== */}

      <div className="analytics-section">
        <div className="section-heading">
          <h2>Monthly Expenses</h2>

          <p>
            Track how your expenses change
            over time.
          </p>
        </div>

        {expenseEntries.length === 0 ? (
          <EmptyState
            title="No monthly expense data"
            message="Monthly expenses will appear here after you add expenses."
          />
        ) : (
          <div className="monthly-data-list">
            {expenseEntries.map(([month, amount]) => (
              <div
                className="monthly-data-row"
                key={month}
              >
                <span>{month}</span>

                <strong>
                  {formatCurrency(amount)}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================
          MONTHLY INCOME
      ====================================== */}

      <div className="analytics-section">
        <div className="section-heading">
          <h2>Monthly Income</h2>

          <p>
            Review your income across
            different months.
          </p>
        </div>

        {incomeEntries.length === 0 ? (
          <EmptyState
            title="No monthly income data"
            message="Monthly income will appear here after you add income."
          />
        ) : (
          <div className="monthly-data-list">
            {incomeEntries.map(([month, amount]) => (
              <div
                className="monthly-data-row"
                key={month}
              >
                <span>{month}</span>

                <strong>
                  {formatCurrency(amount)}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================
          MONTHLY INCOME VS EXPENSES
      ====================================== */}

      <div className="chart-card">
        <h2>Monthly Income Vs Expenses</h2>

        {monthlyChartData.length === 0 ? (
          <p className="no-data">
            No monthly data available.
          </p>
        ) : (
          <div className="chart-scroll">
            <BarChart
              width={700}
              height={420}
              data={monthlyChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickFormatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                ]}
              />

              <Legend />

              <Bar
                dataKey="income"
                name="Income"
                fill="#16a34a"
                radius={[5, 5, 0, 0]}
                isAnimationActive={false}
              />

              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#dc2626"
                radius={[5, 5, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </div>
        )}
      </div>
{/* ======================================
    MONTHLY SAVINGS
====================================== */}

<div className="analytics-section">

  <div className="section-heading">
    <h2>Monthly Savings</h2>

    <p>
      Track how much money you save each month.
    </p>
  </div>

  {monthlySavingsData.length === 0 ? (
    <EmptyState
      title="No monthly savings data"
      message="Add income or expenses to view monthly savings."
    />
  ) : (
    <div className="monthly-data-list">

      {monthlySavingsData.map(({ month, savings }) => (
        <div
          className="monthly-data-row"
          key={month}
        >
          <span>{month}</span>

          <strong
            className={
              savings < 0
                ? "negative"
                : "positive"
            }
          >
            {formatCurrency(savings)}
          </strong>
        </div>
      ))}

    </div>
  )}

</div>
      {/* ======================================
          FINANCIAL INSIGHTS
      ====================================== */}

      <div className="analytics-section">
        <div className="section-heading">
          <h2>Financial Insights</h2>

          <p>
            Important information generated
            from your financial activity.
          </p>
        </div>

        <div className="analytics-insights-grid">

          <div className="analytics-insight-card">
            <span>Average Expense</span>

            <strong>
              {formatCurrency(analytics.averageExpense)}
            </strong>
          </div>

          <div className="analytics-insight-card">
            <span>Top Spending Category</span>

            <strong>
              {analytics.topCategory || "None"}
            </strong>
          </div>

          <div className="analytics-insight-card">
            <span>Remaining Balance</span>

            <strong
              className={
                Number(analytics.balance) < 0
                  ? "negative"
                  : "positive"
              }
            >
              {formatCurrency(analytics.balance)}
            </strong>
          </div>

        </div>
      </div>
<div className="analytics-insight-card">
  <span>Expense-to-Income Ratio</span>

  <strong>
    {expenseToIncomeRatio.toFixed(1)}%
  </strong>

  <p>
    {expenseRatioMessage}
  </p>
</div>
<div className="analytics-insight-card">
  <span>Total Savings</span>

  <strong
    className={
      savingsAmount < 0
        ? "negative"
        : "positive"
    }
  >
    {formatCurrency(savingsAmount)}
  </strong>

  <p>
    {savingsAmountMessage}
  </p>
</div>
      {/* ======================================
          SMART BUDGET INSIGHTS
      ====================================== */}

      {budgetInsights.length > 0 && (
        <div className="analytics-section">
          <div className="section-heading">
            <h2>Smart Budget Insights</h2>

            <p>
              Recommendations generated from
              your spending and budget data.
            </p>
          </div>

          <div className="analytics-insights-list">
            {budgetInsights.map((insight, index) => (
              <div
                className="analytics-insight-item"
                key={index}
              >
                <span>💡</span>

                <p>{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default Analytics;