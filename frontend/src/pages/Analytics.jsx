import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getAnalytics } from "../services/analyticsApi";
import Loading from "../components/Loading";
import "../styles/analytics.css";

const Analytics = () => {

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        const data =
          await getAnalytics();

        setAnalytics(data.analytics);

      } catch (error) {

        console.error(
          "Analytics Error:",
          error
        );

        setError(
          "Failed to load analytics"
        );

      } finally {

        setLoading(false);

      }
    };

    loadAnalytics();

  }, []);


  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  };
if (loading) {
  return <Loading message="Loading analytics..." />;
}

  
  


  if (error) {

    return (
      <div className="analytics-page">
        <p>{error}</p>
      </div>
    );

  }


  /*
      Category chart data
  */

  const categoryData =
    Object.entries(
      analytics.categorySpending || {}
    ).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );


  /*
      Monthly chart data
  */

  const months = new Set([
    ...Object.keys(
      analytics.monthlyIncome || {}
    ),

    ...Object.keys(
      analytics.monthlyExpenses || {}
    ),
  ]);

  const monthlyData =
    Array.from(months)
      .sort()
      .map((month) => ({
        month,

        income:
          analytics.monthlyIncome[
            month
          ] || 0,

        expenses:
          analytics.monthlyExpenses[
            month
          ] || 0,

        balance:
          analytics.monthlyBalance[
            month
          ] || 0,
      }));


  /*
      Insights
  */

  const getInsight = () => {

    if (
      analytics.totalIncome === 0
    ) {

      return "Add income to start receiving financial insights.";

    }

    if (
      analytics.balance < 0
    ) {

      return "⚠️ Your expenses are higher than your income. Consider reducing non-essential spending.";

    }

    if (
      analytics.savingsRate < 10
    ) {

      return "⚠️ Your current savings rate is low. Try to reduce unnecessary expenses.";

    }

    if (
      analytics.savingsRate >= 30
    ) {

      return "🎉 Excellent! You are maintaining a strong savings rate.";

    }

    return "👍 Your finances are currently positive. Keep monitoring your spending.";

  };


  return (

    <div className="analytics-page">

      <div className="analytics-heading">

        <h1>
          Financial Analytics
        </h1>

        <p>
          Understand your spending
          patterns and financial health.
        </p>

      </div>


      {/* Insight */}

      <div className="insight-card">

        <h2>
          💡 Financial Insight
        </h2>

        <p>
          {getInsight()}
        </p>

      </div>


      {/* Monthly */}

      <div className="chart-card">

        <h2>
          Monthly Income vs Expenses
        </h2>

        <p>
          Compare your income and
          expenses over time.
        </p>


        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart
            data={monthlyData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
            />

            <YAxis />

            <Tooltip
              formatter={(value) =>
                formatCurrency(value)
              }
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="income"
              name="Income"
            />

            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
            />

            <Line
              type="monotone"
              dataKey="balance"
              name="Balance"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* Category */}

      <div className="analytics-chart-grid">

        <div className="chart-card">

          <h2>
            Spending by Category
          </h2>

          <p>
            Your expense distribution.
          </p>


          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <PieChart>

              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >

                {categoryData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                    />
                  )
                )}

              </Pie>

              <Tooltip
                formatter={(value) =>
                  formatCurrency(value)
                }
              />

            </PieChart>

          </ResponsiveContainer>

        </div>


        <div className="chart-card">

          <h2>
            Category Comparison
          </h2>

          <p>
            Compare how much you spend
            in each category.
          </p>


          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={categoryData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="category"
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  formatCurrency(value)
                }
              />

              <Bar
                dataKey="amount"
                name="Spending"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* Key Statistics */}

      <div className="stats-card">

        <h2>
          Key Statistics
        </h2>

        <div className="stats-grid">

          <div>
            <span>
              Average Expense
            </span>

            <strong>
              {formatCurrency(
                analytics.averageExpense
              )}
            </strong>
          </div>


          <div>
            <span>
              Top Category
            </span>

            <strong>
              {analytics.topCategory ||
                "None"}
            </strong>
          </div>


          <div>
            <span>
              Savings Rate
            </span>

            <strong>
              {Number(
                analytics.savingsRate || 0
              ).toFixed(1)}
              %
            </strong>
          </div>


          <div>
            <span>
              Balance
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

  );

};

export default Analytics;