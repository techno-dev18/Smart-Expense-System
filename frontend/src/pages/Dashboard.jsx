import { useEffect, useState } from "react";

import { getAnalytics } from "../services/analyticsApi";

import "../styles/dashboard.css";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

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

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

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

  return (
    <div className="dashboard-page">

      {/* Header */}

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

      {/* Summary Cards */}

      <div className="dashboard-cards">

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


      {/* Analytics Section */}

      <div className="analytics-grid">

        {/* Category Spending */}

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

              <p className="empty-message">
                No expenses recorded yet.
              </p>

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


        {/* Financial Summary */}

        <div className="analytics-panel">

          <h2>
            Financial Summary
          </h2>

          <p className="panel-subtitle">
            Key insights from your transactions
          </p>


          <div className="summary-list">

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


            <div className="summary-item">

              <span>
                Top Spending Category
              </span>

              <strong>
                {analytics.topCategory ||
                  "None"}
              </strong>

            </div>


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