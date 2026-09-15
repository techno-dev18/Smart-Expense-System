import { useEffect, useState } from "react";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import BudgetCard from "../components/BudgetCard";

import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from "../services/budgetApi";

import { getAnalytics } from "../services/analyticsApi";

import "../styles/budget.css";
import "../styles/forms.css";

const Budget = () => {
  const currentDate = new Date();

  const initialForm = {
    category: "",
    amount: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  };

  const [formData, setFormData] =
    useState(initialForm);

  const [budgets, setBudgets] =
    useState([]);

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        budgetData,
        analyticsData,
      ] = await Promise.all([
        getBudgets(),
        getAnalytics(),
      ]);

      setBudgets(
        budgetData.budgets || []
      );

      setAnalytics(
        analyticsData.analytics || {}
      );
    } catch (error) {
      console.error(
        "Budget Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load budget information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const amount =
      Number(formData.amount);

    const month =
      Number(formData.month);

    const year =
      Number(formData.year);

    if (!formData.category) {
      return "Please select a budget category.";
    }

    if (
      formData.amount === "" ||
      formData.amount === null
    ) {
      return "Budget amount is required.";
    }

    if (!Number.isFinite(amount)) {
      return "Please enter a valid budget amount.";
    }

    if (amount <= 0) {
      return "Budget amount must be greater than 0.";
    }

    if (amount > 100000000) {
      return "Budget amount is too large.";
    }

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      return "Please select a valid month.";
    }

    if (
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      return "Please enter a valid year.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const data = {
        category:
          formData.category,

        amount:
          Number(formData.amount),

        month:
          Number(formData.month),

        year:
          Number(formData.year),
      };

      if (editingId) {
        await updateBudget(
          editingId,
          data
        );

        setSuccess(
          "Budget updated successfully."
        );
      } else {
        await addBudget(data);

        setSuccess(
          "Budget added successfully."
        );
      }

      setFormData({
        ...initialForm,
        month:
          currentDate.getMonth() + 1,
        year:
          currentDate.getFullYear(),
      });

      setEditingId(null);

      await loadData();
    } catch (error) {
      console.error(
        "Save Budget Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Something went wrong while saving the budget."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (budget) => {
    setEditingId(
      budget._id
    );

    setFormData({
      category:
        budget.category || "",

      amount:
        budget.amount || "",

      month:
        budget.month || currentDate.getMonth() + 1,

      year:
        budget.year || currentDate.getFullYear(),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      ...initialForm,
      month:
        currentDate.getMonth() + 1,
      year:
        currentDate.getFullYear(),
    });

    setError("");
    setSuccess("");
  };

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this budget?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteBudget(id);

      setSuccess(
        "Budget deleted successfully."
      );

      await loadData();
    } catch (error) {
      console.error(
        "Delete Budget Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete budget."
      );
    }
  };

  const getBudgetKey = (
    category,
    month,
    year
  ) => {
    return `${category}|${month}|${year}`;
  };

  const getBudgetStatus = (
    usage
  ) => {
    const value =
      Number(usage || 0);

    if (value >= 100) {
      return {
        label: "Over Budget",
        className:
          "budget-status-danger",
      };
    }

    if (value >= 80) {
      return {
        label: "Near Limit",
        className:
          "budget-status-warning",
      };
    }

    return {
      label: "On Track",
      className:
        "budget-status-safe",
    };
  };

  const getPaceStatus = (
    pace
  ) => {
    const value =
      Number(pace || 0);

    if (value >= 120) {
      return {
        label: "High Pace",
        className:
          "pace-danger",
      };
    }

    if (value >= 100) {
      return {
        label: "Ahead",
        className:
          "pace-warning",
      };
    }

    return {
      label: "Healthy",
      className:
        "pace-safe",
    };
  };

  const getRecommendation = (
    budget,
    actual,
    projectedOverspending,
    pace
  ) => {
    const currentMonth =
      currentDate.getMonth() + 1;

    const currentYear =
      currentDate.getFullYear();

    if (
      budget.month === currentMonth &&
      budget.year === currentYear
    ) {
      if (
        Number(projectedOverspending) > 0
      ) {
        return `Reduce ${budget.category} spending to avoid exceeding your monthly budget.`;
      }

      if (Number(pace) >= 120) {
        return `Your ${budget.category} spending is significantly ahead of pace. Consider reducing spending for the rest of the month.`;
      }

      if (Number(pace) >= 100) {
        return `Your ${budget.category} spending is slightly ahead of the expected pace. Keep an eye on upcoming expenses.`;
      }
    }

    if (
      Number(actual) <=
      Number(budget.amount) * 0.5
    ) {
      return `Your ${budget.category} spending is currently well controlled.`;
    }

    return `Continue monitoring your ${budget.category} spending to stay within budget.`;
  };

  if (loading) {
    return (
      <div className="budget-page">
        <Loading
          message="Loading budgets..."
        />
      </div>
    );
  }

  if (
    error &&
    budgets.length === 0
  ) {
    return (
      <div className="budget-page">
        <ErrorState
          title="Unable to load budgets"
          message={error}
          actionText="Try Again"
          onAction={loadData}
        />
      </div>
    );
  }

  const budgetActual =
    analytics?.budgetActual || {};

  const budgetRemaining =
    analytics?.budgetRemaining || {};

  const budgetUsage =
    analytics?.budgetUsage || {};

  const budgetOverspending =
    analytics?.budgetOverspending || {};

  const budgetPace =
    analytics?.budgetPace || {};

  const budgetProjected =
    analytics?.budgetProjected || {};

  const budgetProjectedOverspending =
    analytics?.budgetProjectedOverspending ||
    {};

  const budgetRecommendations =
    analytics?.budgetRecommendations ||
    {};

  return (
    <div className="budget-page">

      <div className="page-header">

        <div>

          <h1>
            Budget
          </h1>

          <p>
            Set spending limits and
            monitor your financial goals.
          </p>

        </div>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="budget-form-container">

        <h2>
          {editingId
            ? "Edit Budget"
            : "Create Budget"}
        </h2>

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          <div>

            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={
                formData.category
              }
              onChange={
                handleChange
              }
              required
            >

              <option value="">
                Select Category
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Transport">
                Transport
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Bills">
                Bills
              </option>

              <option value="Entertainment">
                Entertainment
              </option>

              <option value="Health">
                Health
              </option>

              <option value="Education">
                Education
              </option>

              <option value="Travel">
                Travel
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          <div>

            <label htmlFor="amount">
              Budget Amount
            </label>

            <input
              id="amount"
              type="number"
              name="amount"
              placeholder="Enter budget amount"
              min="0.01"
              max="100000000"
              step="0.01"
              value={
                formData.amount
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          <div>

            <label htmlFor="month">
              Month
            </label>

            <select
              id="month"
              name="month"
              value={
                formData.month
              }
              onChange={
                handleChange
              }
              required
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

          <div>

            <label htmlFor="year">
              Year
            </label>

            <input
              id="year"
              type="number"
              name="year"
              min="2000"
              max="2100"
              step="1"
              value={
                formData.year
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          <div className="form-actions">

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Budget"
                : "Create Budget"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
                disabled={submitting}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      <div className="budget-list">

        <div className="section-heading">

          <h2>
            Your Budgets
          </h2>

          <p>
            Monitor your spending,
            projected expenses and
            budget recommendations.
          </p>

        </div>

        {budgets.length === 0 ? (

          <EmptyState
            title="No budgets yet"
            message="Create your first budget to start controlling your spending."
            actionText="Create Your First Budget"
            onAction={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />

        ) : (

          <div className="budget-items">

            {budgets.map(
              (budget) => {
                const key =
                  getBudgetKey(
                    budget.category,
                    budget.month,
                    budget.year
                  );

                const actual =
                  Number(
                    budgetActual[
                      key
                    ] || 0
                  );

                const remaining =
                  Number(
                    budgetRemaining[
                      key
                    ] ??
                      Number(
                        budget.amount
                      ) -
                        actual
                  );

                const usage =
                  Number(
                    budgetUsage[
                      key
                    ] ||
                      0
                  );

                const overspending =
                  Number(
                    budgetOverspending[
                      key
                    ] ||
                      0
                  );

                const pace =
                  Number(
                    budgetPace[
                      key
                    ] ||
                      0
                  );

                const projected =
                  Number(
                    budgetProjected[
                      key
                    ] ||
                      actual
                  );

                const projectedOverspending =
                  Number(
                    budgetProjectedOverspending[
                      key
                    ] ||
                      0
                  );

                const recommendation =
                  budgetRecommendations[
                    key
                  ] ||
                  getRecommendation(
                    budget,
                    actual,
                    projectedOverspending,
                    pace
                  );

                const status =
                  getBudgetStatus(
                    usage
                  );

                const paceStatus =
                  getPaceStatus(
                    pace
                  );

                return (
                  <BudgetCard
                    key={
                      budget._id
                    }
                    budget={
                      budget
                    }
                    actual={
                      actual
                    }
                    usage={
                      usage
                    }
                    remaining={
                      remaining
                    }
                    overspending={
                      overspending
                    }
                    pace={
                      pace
                    }
                    projected={
                      projected
                    }
                    projectedOverspending={
                      projectedOverspending
                    }
                    recommendation={
                      recommendation
                    }
                    status={
                      status
                    }
                    paceStatus={
                      paceStatus
                    }
                    onEdit={
                      handleEdit
                    }
                    onDelete={
                      handleDelete
                    }
                  />
                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default Budget;