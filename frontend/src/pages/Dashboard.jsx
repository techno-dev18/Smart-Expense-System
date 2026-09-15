import { useEffect, useState } from "react";

import { getAnalytics } from "../services/analyticsApi";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import DashboardCard from "../components/DashboardCard";

import "../styles/dashboard.css";


const Dashboard = () => {

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD ANALYTICS
  // ==========================================

  const loadAnalytics = async () => {

    try {

      setLoading(true);

      setError("");

      const data =
        await getAnalytics();

      setAnalytics(
        data.analytics
      );

    } catch (error) {

      console.error(
        "Analytics Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard"
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

  }, []);


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (
    amount
  ) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="dashboard-page">

        <Loading
          message="Loading dashboard..."
        />

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

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


  // ==========================================
  // EMPTY
  // ==========================================

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


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Here's an overview of your
            financial activity.
          </p>

        </div>


        <button
          type="button"
          className="refresh-button"
          onClick={loadAnalytics}
        >
          ↻ Refresh
        </button>

      </div>


      {/* ======================================
          DASHBOARD CARDS
      ====================================== */}

      <div className="dashboard-cards">

        <DashboardCard
          title="Total Income"
          value={formatCurrency(
            analytics.totalIncome
          )}
          icon="₹"
          className="income-card"
        />


        <DashboardCard
          title="Total Expenses"
          value={formatCurrency(
            analytics.totalExpenses
          )}
          icon="↓"
          className="expense-card"
        />


        <DashboardCard
          title="Balance"
          value={formatCurrency(
            analytics.balance
          )}
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


      {/* ======================================
          ANALYTICS GRID
      ====================================== */}

      <div className="analytics-grid">

        {/* ====================================
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
              analytics.categorySpending ||
                {}
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
                        {formatCurrency(
                          amount
                        )}
                      </strong>

                    </div>


                    <div className="category-bar">

                      <div
                        className="category-bar-fill"
                        style={{
                          width: `${
                            analytics.totalExpenses >
                            0
                              ? (Number(
                                  amount
                                ) /
                                  Number(
                                    analytics.totalExpenses
                                  )) *
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


        {/* ====================================
            FINANCIAL SUMMARY
        ==================================== */}

        <div className="analytics-panel">

          <h2>
            Financial Summary
          </h2>

          <p className="panel-subtitle">
            Key insights from your
            transactions
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