
import React, { useEffect, useState } from "react";

import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from "../services/budgetApi";

import { getAnalytics } from "../services/analyticsApi";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

import "../styles/forms.css";

function Budget() {
  // ==========================================
  // STATES
  // ==========================================

  const [budgets, setBudgets] = useState([]);

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        budgetResponse,
        analyticsResponse,
      ] = await Promise.all([
        getBudgets(),
        getAnalytics(),
      ]);

      setBudgets(
        budgetResponse.budgets || []
      );

      setAnalytics(
        analyticsResponse.analytics || {}
      );

    } catch (err) {
      console.error(
        "Budget loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load budget data."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const data = {
        category:
          formData.category.trim(),

        amount:
          Number(formData.amount),

        month:
          Number(formData.month),

        year:
          Number(formData.year),
      };

      // Category validation

      if (!data.category) {
        setError(
          "Please enter a category."
        );

        return;
      }

      // Amount validation

      if (data.amount <= 0) {
        setError(
          "Budget amount must be greater than 0."
        );

        return;
      }

      // Update existing budget

      if (editingId) {
        await updateBudget(
          editingId,
          data
        );
      }

      // Create new budget

      else {
        await addBudget(data);
      }

      // Reset form

      resetForm();

      // Reload budget + analytics

      await loadData();

    } catch (err) {
      console.error(
        "Budget save error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save budget."
      );
    }
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      category: "",

      amount: "",

      month:
        new Date().getMonth() + 1,

      year:
        new Date().getFullYear(),
    });

    setEditingId(null);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (budget) => {
    setEditingId(
      budget._id
    );

    setFormData({
      category:
        budget.category,

      amount:
        budget.amount,

      month:
        budget.month,

      year:
        budget.year,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this budget?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBudget(id);

      await loadData();

    } catch (err) {
      console.error(
        "Budget delete error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete budget."
      );
    }
  };

  // ==========================================
  // BUDGET KEY
  // ==========================================

  const getBudgetKey = (budget) => {
    return (
      `${budget.category}|` +
      `${String(budget.year).padStart(4, "0")}-` +
      `${String(budget.month).padStart(2, "0")}`
    );
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getBudgetStatus = (
    usage,
    overspending
  ) => {
    if (overspending > 0) {
      return {
        className: "overspent",
        label: "Overspent",
      };
    }

    if (usage >= 90) {
      return {
        className: "near-limit",
        label: "Near Limit",
      };
    }

    if (usage >= 70) {
      return {
        className: "warning",
        label: "Watch Spending",
      };
    }

    return {
      className: "safe",
      label: "Within Budget",
    };
  };

  // ==========================================
  // PACE STATUS
  // ==========================================

  const getPaceStatus = (pace) => {
    if (pace >= 120) {
      return {
        className: "pace-danger",
        label: "Spending Too Fast",
      };
    }

    if (pace >= 100) {
      return {
        className: "pace-warning",
        label: "Above Expected Pace",
      };
    }

    return {
      className: "pace-good",
      label: "On Track",
    };
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="budget-page">
        <Loading
          message="Loading budgets..."
        />
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error && !analytics) {
    return (
      <div className="budget-page">

        <div className="form-error">
          {error}
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={loadData}
        >
          Try Again
        </button>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="budget-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="budget-header">

        <div>

          <h1>
            Budget Intelligence
          </h1>

          <p>
            Plan your spending and understand
            where your money is going.
          </p>

        </div>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}


      {/* ======================================
          FORM
      ====================================== */}

      <div className="budget-form-card">

        <h2>
          {editingId
            ? "Update Budget"
            : "Create Budget"}
        </h2>


        <form
          onSubmit={handleSubmit}
          className="budget-form"
        >

          {/* Category */}

          <div className="form-group">

            <label>
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Food"
              required
            />

          </div>


          {/* Amount */}

          <div className="form-group">

            <label>
              Budget Amount
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              required
            />

          </div>


          {/* Month */}

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


          {/* Year */}

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
              required
            />

          </div>


          {/* Form Actions */}

          <div className="budget-form-actions">

            <button
              type="submit"
              className="primary-button"
            >

              {editingId
                ? "Update Budget"
                : "Create Budget"}

            </button>


            {editingId && (

              <button
                type="button"
                className="secondary-button"
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

          <div className="section-heading">

            <h2>
              Smart Budget Insights
            </h2>

            <p>
              Automatically generated from your
              spending activity.
            </p>

          </div>


          <div className="insight-grid">

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

        <div className="section-heading">

          <h2>
            Your Budgets
          </h2>

          <p>
            Monitor your spending against
            your planned limits.
          </p>

        </div>


        {/* ====================================
            EMPTY STATE
        ==================================== */}

        {budgets.length === 0 ? (

          <EmptyState
            title="No budgets created"
            message="Create your first monthly budget to start monitoring your spending and receive smart budget recommendations."
            actionText="Create Your First Budget"
            onAction={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />

        ) : (

          /* ==================================
             BUDGET GRID
          ================================== */

          <div className="budget-grid">

            {budgets.map((budget) => {

              // =================================
              // BUDGET KEY
              // =================================

              const key =
                getBudgetKey(budget);


              // =================================
              // ANALYTICS
              // =================================

              const actual =
                analytics?.budgetActual?.[key] ||
                0;


              const remaining =
                analytics?.budgetRemaining?.[key] ??
                budget.amount;


              const usage =
                analytics?.budgetUsage?.[key] ||
                0;


              const overspending =
                analytics?.budgetOverspending?.[key] ||
                0;


              const pace =
                analytics?.budgetPace?.[key] ||
                0;


              const projected =
                analytics?.budgetProjected?.[key] ||
                0;


              const projectedOverspending =
                analytics
                  ?.budgetProjectedOverspending?.[key] ||
                0;


              // =================================
              // STATUS
              // =================================

              const status =
                getBudgetStatus(
                  usage,
                  overspending
                );


              const paceStatus =
                getPaceStatus(
                  pace
                );


              // =================================
              // SMART RECOMMENDATION
              // =================================
              //
              // IMPORTANT:
              // C++ now returns:
              //
              // Food|2026-09=Recommendation
              //
              // So we must use the budget key,
              // NOT budgets.indexOf(budget).
              // =================================

              const recommendation =
                analytics
                  ?.budgetRecommendations?.[key];


              return (

                <div
                  className={`budget-card ${status.className}`}
                  key={budget._id}
                >

                  {/* =================================
                      CARD HEADER
                  ================================= */}

                  <div className="budget-card-header">

                    <div>

                      <h3>
                        {budget.category}
                      </h3>

                      <span>
                        {budget.month}/
                        {budget.year}
                      </span>

                    </div>


                    <span
                      className={`budget-status ${status.className}`}
                    >

                      {status.label}

                    </span>

                  </div>


                  {/* =================================
                      AMOUNTS
                  ================================= */}

                  <div className="budget-amounts">

                    <div>

                      <span>
                        Budget
                      </span>

                      <strong>
                        ₹
                        {Number(
                          budget.amount
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Spent
                      </span>

                      <strong>
                        ₹
                        {Number(
                          actual
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Remaining
                      </span>

                      <strong
                        className={
                          remaining < 0
                            ? "negative"
                            : ""
                        }
                      >

                        ₹
                        {Number(
                          remaining
                        ).toLocaleString("en-IN")}

                      </strong>

                    </div>

                  </div>


                  {/* =================================
                      PROGRESS
                  ================================= */}

                  <div className="budget-progress">

                    <div className="budget-progress-info">

                      <span>
                        Budget Usage
                      </span>

                      <strong>
                        {Number(
                          usage
                        ).toFixed(1)}
                        %
                      </strong>

                    </div>


                    <div className="budget-progress-track">

                      <div
                        className={`budget-progress-bar ${status.className}`}
                        style={{
                          width: `${Math.min(
                            Math.max(
                              usage,
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* =================================
                      SPENDING PACE
                  ================================= */}

                  <div className="budget-intelligence">

                    <div className="intelligence-card">

                      <div className="intelligence-title">

                        <span>
                          📊 Spending Pace
                        </span>

                        <span
                          className={`pace-badge ${paceStatus.className}`}
                        >

                          {paceStatus.label}

                        </span>

                      </div>


                      <strong>
                        {Number(
                          pace
                        ).toFixed(1)}
                        %
                      </strong>


                      <p>
                        Compared with the expected
                        spending pace for this month.
                      </p>

                    </div>


                    {/* =================================
                        PROJECTED SPENDING
                    ================================= */}

                    <div className="intelligence-card">

                      <div className="intelligence-title">

                        <span>
                          🔮 Projected Spending
                        </span>

                      </div>


                      <strong>
                        ₹
                        {Number(
                          projected
                        ).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </strong>


                      <p>
                        Estimated spending by the
                        end of the month.
                      </p>

                    </div>


                    {/* =================================
                        PROJECTED RISK
                    ================================= */}

                    <div className="intelligence-card">

                      <div className="intelligence-title">

                        <span>
                          ⚠️ Projected Risk
                        </span>

                      </div>


                      <strong
                        className={
                          projectedOverspending > 0
                            ? "negative"
                            : "positive"
                        }
                      >

                        {projectedOverspending > 0
                          ? `₹${Number(
                              projectedOverspending
                            ).toLocaleString(
                              "en-IN",
                              {
                                maximumFractionDigits: 0,
                              }
                            )} over`
                          : "No overspending"}

                      </strong>


                      <p>

                        {projectedOverspending > 0
                          ? "Current spending pace may exceed your budget."
                          : "Your current pace is projected to stay within budget."}

                      </p>

                    </div>

                  </div>


                  {/* =================================
                      RECOMMENDATION
                  ================================= */}

                  {recommendation && (

                    <div className="budget-recommendation">

                      <div className="recommendation-icon">
                        💡
                      </div>


                      <div>

                        <h4>
                          Smart Recommendation
                        </h4>

                        <p>
                          {recommendation}
                        </p>

                      </div>

                    </div>

                  )}


                  {/* =================================
                      OVERSPENDING
                  ================================= */}

                  {overspending > 0 && (

                    <div className="overspending-message">

                      ⚠️ You have exceeded this
                      budget by ₹
                      {Number(
                        overspending
                      ).toLocaleString(
                        "en-IN"
                      )}.

                    </div>

                  )}


                  {/* =================================
                      ACTIONS
                  ================================= */}

                  <div className="budget-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(budget)
                      }
                      className="edit-button"
                    >

                      Edit

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          budget._id
                        )
                      }
                      className="delete-button"
                    >

                      Delete

                    </button>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default Budget;

