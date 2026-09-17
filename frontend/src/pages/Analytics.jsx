import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
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
      window.removeEventListener(
        "focus",
        handleFocus
      );
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

  const categorySpending =
    analytics.categorySpending || {};

  const monthlyExpenses =
    analytics.monthlyExpenses || {};

  const monthlyIncome =
    analytics.monthlyIncome || {};

  const budgetInsights =
    analytics.budgetInsights || [];

  const categoryEntries =
    Object.entries(categorySpending);

  const expenseEntries =
    Object.entries(monthlyExpenses).sort(
      ([monthA], [monthB]) =>
        monthA.localeCompare(monthB)
    );

  const incomeEntries =
    Object.entries(monthlyIncome).sort(
      ([monthA], [monthB]) =>
        monthA.localeCompare(monthB)
    );

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
      expenses: Number(
        monthlyExpenses[month] || 0
      ),
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
            {Number(
              analytics.savingsRate || 0
            ).toFixed(1)}
            %
          </strong>
        </div>

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
            {categoryEntries.map(
              ([category, amount]) => {
                const percentage =
                  Number(analytics.totalExpenses) > 0
                    ? (Number(amount) /
                        Number(
                          analytics.totalExpenses
                        )) *
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
              }
            )}
          </div>
        )}
      </div>

      {/* ======================================
          SPENDING PIE CHART
      ====================================== */}
{/* Category Spending Chart */}
<div className="chart-card">
  <h2>Category Spending</h2>

  {categoryChartData.length === 0 ? (
    <p className="no-data">No category spending data available.</p>
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
              fill={CHART_COLORS[index % CHART_COLORS.length]}
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
            {expenseEntries.map(
              ([month, amount]) => (
                <div
                  className="monthly-data-row"
                  key={month}
                >
                  <span>{month}</span>

                  <strong>
                    {formatCurrency(amount)}
                  </strong>
                </div>
              )
            )}
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
            {incomeEntries.map(
              ([month, amount]) => (
                <div
                  className="monthly-data-row"
                  key={month}
                >
                  <span>{month}</span>

                  <strong>
                    {formatCurrency(amount)}
                  </strong>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ======================================
          MONTHLY INCOME VS EXPENSES
      ====================================== */}

      {/* Monthly Income and Expenses Chart */}
<div className="chart-card">
  <h2>Monthly Income Vs Expenses</h2>

  {monthlyChartData.length === 0 ? (
    <p className="no-data">No monthly data available.</p>
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
              {formatCurrency(
                analytics.averageExpense
              )}
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
            {budgetInsights.map(
              (insight, index) => (
                <div
                  className="analytics-insight-item"
                  key={index}
                >
                  <span>💡</span>

                  <p>{insight}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Analytics;