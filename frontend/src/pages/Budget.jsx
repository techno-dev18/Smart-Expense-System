import React, { useEffect, useState } from "react";
import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from "../services/budgetApi";

import { getAnalytics } from "../services/analyticsApi";

import "../styles/forms.css";

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // ==========================================
  // FETCH DATA
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [budgetResponse, analyticsResponse] =
        await Promise.all([
          getBudgets(),
          getAnalytics(),
        ]);

      setBudgets(
        budgetResponse.budgets ||
        budgetResponse.data ||
        []
      );

      setAnalytics(
        analyticsResponse.analytics ||
        analyticsResponse.data ||
        analyticsResponse
      );

    } catch (error) {
      console.error(
        "Failed to fetch budget data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // ==========================================
  // INPUT HANDLER
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // ==========================================
  // ADD / UPDATE BUDGET
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.category ||
      !formData.amount
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const data = {
        category: formData.category,
        amount: Number(formData.amount),
        month: Number(formData.month),
        year: Number(formData.year),
      };

      if (editingId) {
        await updateBudget(editingId, data);
      } else {
        await addBudget(data);
      }

      resetForm();

      await fetchData();

    } catch (error) {
      console.error(
        "Budget save error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to save budget."
      );
    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteBudget(id);

      await fetchData();

    } catch (error) {
      console.error(
        "Budget delete error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete budget."
      );
    }
  };


  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (budget) => {
    setEditingId(budget._id);

    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ==========================================
  // RESET
  // ==========================================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      category: "",
      amount: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };


  // ==========================================
  // FORMAT MONTH
  // ==========================================

  const getMonthKey = (budget) => {
    return (
      String(budget.year).padStart(4, "0") +
      "-" +
      String(budget.month).padStart(2, "0")
    );
  };


  // ==========================================
  // GET BUDGET INTELLIGENCE
  // ==========================================

  const getBudgetStats = (budget) => {
    const key =
      `${budget.category}|${getMonthKey(budget)}`;

    const actual =
      analytics?.budgetActual?.[key] || 0;

    const remaining =
      analytics?.budgetRemaining?.[key] ??
      budget.amount - actual;

    const usage =
      analytics?.budgetUsage?.[key] ??
      0;

    const overspending =
      analytics?.budgetOverspending?.[key] ??
      0;

    return {
      actual,
      remaining,
      usage,
      overspending,
    };
  };


  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = (usage, overspending) => {
    if (overspending > 0) {
      return {
        text: "Overspent",
        className: "overspent",
      };
    }

    if (usage >= 90) {
      return {
        text: "Near Limit",
        className: "near-limit",
      };
    }

    if (usage >= 70) {
      return {
        text: "Watch Spending",
        className: "warning",
      };
    }

    return {
      text: "Within Budget",
      className: "safe",
    };
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="budget-page">
        <h1>Budget</h1>
        <p>Loading budget intelligence...</p>
      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="budget-page">

      <div className="budget-header">

        <div>
          <h1>Smart Budget</h1>

          <p>
            Plan your spending and monitor
            your financial limits.
          </p>
        </div>

      </div>


      {/* ======================================
          BUDGET FORM
      ====================================== */}

      <div className="budget-form-card">

        <h2>
          {editingId
            ? "Update Budget"
            : "Create Budget"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Category
            </label>

            <input
              type="text"
              name="category"
              placeholder="e.g. Food"
              value={formData.category}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Budget Amount
            </label>

            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>
                Month
              </label>

              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
              >

                <option value="1">
                  January
                </option>

                <option value="2">
                  February
                </option>

                <option value="3">
                  March
                </option>

                <option value="4">
                  April
                </option>

                <option value="5">
                  May
                </option>

                <option value="6">
                  June
                </option>

                <option value="7">
                  July
                </option>

                <option value="8">
                  August
                </option>

                <option value="9">
                  September
                </option>

                <option value="10">
                  October
                </option>

                <option value="11">
                  November
                </option>

                <option value="12">
                  December
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Year
              </label>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2020"
                max="2100"
                required
              />

            </div>

          </div>


          <div className="budget-form-actions">

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Budget"
                : "Create Budget"}
            </button>


            {editingId && (
              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>
{/* ======================================
    SMART INSIGHTS
====================================== */}

{analytics?.budgetInsights?.length > 0 && (

  <div className="budget-insights">

    <h2>
      Smart Budget Insights
    </h2>

    <div className="insight-list">

      {analytics.budgetInsights.map(
        (insight, index) => (

          <div
            className="insight-card"
            key={index}
          >

            <span className="insight-icon">
              💡
            </span>

            <p>
              {insight}
            </p>

          </div>

        )
      )}

    </div>

  </div>

)}

      {/* ======================================
          BUDGET LIST
      ====================================== */}

      <div className="budget-list">

        <h2>
          Your Budgets
        </h2>


        {budgets.length === 0 ? (

          <div className="empty-budget">

            <h3>
              No budgets created yet
            </h3>

            <p>
              Create your first monthly
              spending budget above.
            </p>

          </div>

        ) : (

          budgets.map((budget) => {

            const stats =
              getBudgetStats(budget);

            const status =
              getStatus(
                stats.usage,
                stats.overspending
              );

            const progress =
              Math.min(stats.usage, 100);

            return (

              <div
                className="budget-card"
                key={budget._id}
              >

                {/* TOP */}

                <div className="budget-card-top">

                  <div>

                    <h3>
                      {budget.category}
                    </h3>

                    <p>
                      {getMonthKey(budget)}
                    </p>

                  </div>


                  <span
                    className={`budget-status ${status.className}`}
                  >
                    {status.text}
                  </span>

                </div>


                {/* AMOUNTS */}

                <div className="budget-amounts">

                  <div>

                    <span>
                      Budget
                    </span>

                    <strong>
                      ₹{budget.amount.toLocaleString()}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Spent
                    </span>

                    <strong>
                      ₹{stats.actual.toLocaleString()}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Remaining
                    </span>

                    <strong
                      className={
                        stats.remaining < 0
                          ? "negative"
                          : "positive"
                      }
                    >
                      ₹
                      {Math.abs(
                        stats.remaining
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>


                {/* PROGRESS */}

                <div className="budget-progress-section">

                  <div className="budget-progress-label">

                    <span>
                      Budget Usage
                    </span>

                    <strong>
                      {stats.usage.toFixed(1)}%
                    </strong>

                  </div>


                  <div className="budget-progress">

                    <div
                      className={`budget-progress-bar ${status.className}`}
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>


                {/* OVERSPENDING */}

                {stats.overspending > 0 && (

                  <div className="overspending-message">

                    ⚠ You have overspent this
                    budget by{" "}

                    <strong>
                      ₹
                      {stats.overspending.toLocaleString()}
                    </strong>

                  </div>

                )}


                {/* ACTIONS */}

                <div className="budget-actions">

                  <button
                    onClick={() =>
                      handleEdit(budget)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(budget._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            );
          })

        )}

      </div>

    </div>
  );
}

export default Budget;