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
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const data = await getAnalytics();

      if (!data || !data.analytics) {
        setAnalytics(null);
        return;
      }

      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Analytics Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAnalytics();

        if (!data || !data.analytics) {
          setAnalytics(null);
          return;
        }

        setAnalytics(data.analytics);
      } catch (error) {
        console.error("Analytics Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = useCallback((amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  }, []);

  if (loading && !analytics) {
    return (
      <main
        className="dashboard-page"
        aria-busy="true"
        aria-live="polite"
      >
        <Loading message="Loading dashboard..." />
      </main>
    );
  }

  if (error && !analytics) {
    return (
      <main className="dashboard-page" aria-live="polite">
        <ErrorState
          title="Unable to load dashboard"
          message={error}
          actionText="Try Again"
          onAction={() => {
            setLoading(false);
            loadAnalytics();
          }}
        />
      </main>
    );
  }

  if (!analytics) {
    return (
      <main className="dashboard-page" aria-live="polite">
        <EmptyState
          title="No dashboard data"
          message="We couldn't find any financial data to display."
          actionText="Refresh Dashboard"
          onAction={() => {
            setLoading(false);
            loadAnalytics();
          }}
        />
      </main>
    );
  }

  return (
    <main
      className="dashboard-page"
      aria-busy={loading}
    >
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
          onClick={() => {
            setLoading(false);
            loadAnalytics();
          }}
          disabled={loading}
          aria-label="Refresh dashboard analytics"
          aria-busy={loading}
        >
          {loading ? "↻ Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {error && (
        <div
          className="dashboard-inline-error"
          role="alert"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => {
              setLoading(false);
              loadAnalytics();
            }}
          >
            Try Again
          </button>
        </div>
      )}

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
              ).map(([category, amount]) => {
                const percentage =
                  Number(analytics.totalExpenses) > 0
                    ? Math.min(
                        (Number(amount) /
                          Number(analytics.totalExpenses)) *
                          100,
                        100
                      )
                    : 0;

                return (
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
                      aria-valuenow={percentage}
                    >
                      <div
                        className="category-bar-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
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