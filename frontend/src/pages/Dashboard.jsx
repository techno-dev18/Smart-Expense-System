import { useCallback, useEffect, useState } from "react";

import { getAnalytics } from "../services/analyticsApi";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import DashboardCard from "../components/DashboardCard";

import "../styles/dashboard.css";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAnalytics();

      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Analytics Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const formatCurrency = useCallback((amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Loading message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <ErrorState
          title="Unable to load dashboard"
          message={error}
          actionText="Try Again"
          onAction={loadAnalytics}
        />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="dashboard-page">
        <EmptyState
          title="No dashboard data"
          message="We couldn't find any financial data to display."
          actionText="Refresh Dashboard"
          onAction={loadAnalytics}
        />
      </div>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Here's an overview of your financial activity.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={loadAnalytics}
          aria-label="Refresh dashboard analytics"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="dashboard-cards">
        <DashboardCard
          title="Total Income"
          value={formatCurrency(analytics.totalIncome)}
          icon="₹"
          className="income-card"
        />

        <DashboardCard
          title="Total Expenses"
          value={formatCurrency(analytics.totalExpenses)}
          icon="↓"
          className="expense-card"
        />

        <DashboardCard
          title="Balance"
          value={formatCurrency(analytics.balance)}
          icon="="
          className="balance-card"
        />

        <DashboardCard
          title="Savings Rate"
          value={`${Number(
            analytics.savingsRate || 0
          ).toFixed(1)}%`}
          icon="%"
          className="savings-card"
        />
      </div>

      <div className="analytics-grid">
        <div className="analytics-panel">
          <div className="panel-header">
            <div>
              <h2>Category Spending</h2>

              <p>Where your money is going</p>
            </div>
          </div>

          <div className="category-list">
            {Object.keys(
              analytics.categorySpending || {}
            ).length === 0 ? (
              <EmptyState
                title="No expenses yet"
                message="Add some expenses to see where your money is going."
              />
            ) : (
              Object.entries(
                analytics.categorySpending
              ).map(([category, amount]) => (
                <div
                  className="category-row"
                  key={category}
                >
                  <div className="category-info">
                    <span>{category}</span>

                    <strong>
                      {formatCurrency(amount)}
                    </strong>
                  </div>

                  <div
                    className="category-bar"
                    role="progressbar"
                    aria-label={`${category} spending`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={
                      analytics.totalExpenses > 0
                        ? Math.min(
                            (Number(amount) /
                              Number(
                                analytics.totalExpenses
                              )) *
                              100,
                            100
                          )
                        : 0
                    }
                  >
                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${
                          analytics.totalExpenses > 0
                            ? Math.min(
                                (Number(amount) /
                                  Number(
                                    analytics.totalExpenses
                                  )) *
                                  100,
                                100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="analytics-panel">
          <h2>Financial Summary</h2>

          <p className="panel-subtitle">
            Key insights from your transactions
          </p>

          <div className="summary-list">
            <div className="summary-item">
              <span>Average Expense</span>

              <strong>
                {formatCurrency(analytics.averageExpense)}
              </strong>
            </div>

            <div className="summary-item">
              <span>Top Spending Category</span>

              <strong>
                {analytics.topCategory || "None"}
              </strong>
            </div>

            <div className="summary-item">
              <span>Total Income</span>

              <strong>
                {formatCurrency(analytics.totalIncome)}
              </strong>
            </div>

            <div className="summary-item">
              <span>Total Expenses</span>

              <strong>
                {formatCurrency(analytics.totalExpenses)}
              </strong>
            </div>

            <div className="summary-item">
              <span>Remaining Balance</span>

              <strong>
                {formatCurrency(analytics.balance)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;