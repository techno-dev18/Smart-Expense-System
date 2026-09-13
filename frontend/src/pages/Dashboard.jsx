
import { useEffect, useState } from "react";

import { getAnalytics } from "../services/analyticsApi";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

import "../styles/dashboard.css";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================
  // LOAD ANALYTICS
  // =========================================

  const loadAnalytics = async () => {
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
  };

  // =========================================
  // LOAD DATA ON PAGE OPEN
  // =========================================

  useEffect(() => {
    loadAnalytics();
  }, []);

  // =========================================
  // FORMAT CURRENCY
  // =========================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <Loading message="Loading dashboard..." />
      </div>
    );
  }

  // =========================================
  // ERROR STATE
  // =========================================

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <p>{error}</p>

          <button onClick={loadAnalytics}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // SAFETY CHECK
  // =========================================

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

  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <div className="dashboard-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Here's an overview of your financial activity.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadAnalytics}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =====================================
          SUMMARY CARDS
      ====================================== */}

      <div className="dashboard-cards">

        {/* Total Income */}

        <div className="dashboard-card income-card">

          <div className="card-icon">
            ₹
          </div>

          <div>
            <p>Total Income</p>

            <h2>
              {formatCurrency(
                analytics.totalIncome
              )}
            </h2>
          </div>

        </div>


        {/* Total Expenses */}

        <div className="dashboard-card expense-card">

          <div className="card-icon">
            ↓
          </div>

          <div>
            <p>Total Expenses</p>

            <h2>
              {formatCurrency(
                analytics.totalExpenses
              )}
            </h2>
          </div>

        </div>


        {/* Balance */}

        <div className="dashboard-card balance-card">

          <div className="card-icon">
            =
          </div>

          <div>
            <p>Balance</p>

            <h2>
              {formatCurrency(
                analytics.balance
              )}
            </h2>
          </div>

        </div>


        {/* Savings Rate */}

        <div className="dashboard-card savings-card">

          <div className="card-icon">
            %
          </div>

          <div>
            <p>Savings Rate</p>

            <h2>
              {Number(
                analytics.savingsRate || 0
              ).toFixed(1)}
              %
            </h2>
          </div>

        </div>

      </div>


      {/* =====================================
          ANALYTICS SECTION
      ====================================== */}

      <div className="analytics-grid">

        {/* ===================================
            CATEGORY SPENDING
        ==================================== */}

        <div className="analytics-panel">

          <div className="panel-header">

            <div>
              <h2>
                Category Spending
              </h2>

              <p>
                Where your money is going
              </p>
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
              ).map(
                ([category, amount]) => (

                  <div
                    className="category-row"
                    key={category}
                  >

                    <div className="category-info">

                      <span>
                        {category}
                      </span>

                      <strong>
                        {formatCurrency(amount)}
                      </strong>

                    </div>


                    <div className="category-bar">

                      <div
                        className="category-bar-fill"
                        style={{
                          width: `${
                            analytics.totalExpenses > 0
                              ? (amount /
                                  analytics.totalExpenses) *
                                100
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>


        {/* ===================================
            FINANCIAL SUMMARY
        ==================================== */}

        <div className="analytics-panel">

          <h2>
            Financial Summary
          </h2>

          <p className="panel-subtitle">
            Key insights from your transactions
          </p>


          <div className="summary-list">

            {/* Average Expense */}

            <div className="summary-item">

              <span>
                Average Expense
              </span>

              <strong>
                {formatCurrency(
                  analytics.averageExpense
                )}
              </strong>

            </div>


            {/* Top Category */}

            <div className="summary-item">

              <span>
                Top Spending Category
              </span>

              <strong>
                {analytics.topCategory ||
                  "None"}
              </strong>

            </div>


            {/* Total Income */}

            <div className="summary-item">

              <span>
                Total Income
              </span>

              <strong>
                {formatCurrency(
                  analytics.totalIncome
                )}
              </strong>

            </div>


            {/* Total Expenses */}

            <div className="summary-item">

              <span>
                Total Expenses
              </span>

              <strong>
                {formatCurrency(
                  analytics.totalExpenses
                )}
              </strong>

            </div>


            {/* Balance */}

            <div className="summary-item">

              <span>
                Remaining Balance
              </span>

              <strong>
                {formatCurrency(
                  analytics.balance
                )}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;

