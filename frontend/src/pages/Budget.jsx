import { useCallback, useEffect, useMemo, useState } from "react";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";

import {
  getBudgets,
  addMonthlyBudget,
  updateMonthlyBudget,
  deleteMonthlyBudget,
  addCategoryBudget,
  updateCategoryBudget,
  deleteCategoryBudget,
} from "../services/budgetApi";

import { getAnalytics } from "../services/analyticsApi";

import "../styles/budget.css";
import "../styles/forms.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CATEGORIES = [
  "Food",
  "Groceries",
  "Shopping",
  "Transport",
  "Housing",
  "Bills",
  "Healthcare",
  "Education",
  "Entertainment",
  "Travel",
  "Personal Care",
  "Other",
];

const currentDate = new Date();

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getMonthKey = (year, month) =>
  `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;

const getInitialMonthlyForm = () => ({
  totalAmount: "",
  month: currentDate.getMonth() + 1,
  year: currentDate.getFullYear(),
});

const getInitialCategoryForm = () => ({
  category: "",
  amount: "",
});

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const Budget = () => {
  const [monthlyBudgets, setMonthlyBudgets] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [analytics, setAnalytics] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedMonthKey, setSelectedMonthKey] = useState(
    getMonthKey(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    )
  );

  const [monthlyForm, setMonthlyForm] = useState(
    getInitialMonthlyForm
  );

  const [categoryForm, setCategoryForm] = useState(
    getInitialCategoryForm
  );

  const [editingMonthlyId, setEditingMonthlyId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [showMonthlyForm, setShowMonthlyForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    setError("");

    try {
      const [budgetResponse, analyticsResponse] =
        await Promise.all([
          getBudgets(),
          getAnalytics(),
        ]);

      setMonthlyBudgets(
        budgetResponse.monthlyBudgets || []
      );

      setBudgets(budgetResponse.budgets || []);

      setAnalytics(
        analyticsResponse.analytics || analyticsResponse || {}
      );
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to load budget data.")
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [budgetResponse, analyticsResponse] =
          await Promise.all([
            getBudgets(),
            getAnalytics(),
          ]);

        if (cancelled) return;

        setMonthlyBudgets(
          budgetResponse.monthlyBudgets || []
        );

        setBudgets(budgetResponse.budgets || []);

        setAnalytics(
          analyticsResponse.analytics || analyticsResponse || {}
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            getErrorMessage(
              err,
              "Unable to load budget data."
            )
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // SELECTED MONTH
  // =====================================================

  const selectedMonthlyBudget = useMemo(
    () =>
      monthlyBudgets.find(
        (item) =>
          getMonthKey(item.year, item.month) ===
          selectedMonthKey
      ) || null,
    [monthlyBudgets, selectedMonthKey]
  );

  const selectedCategoryBudgets = useMemo(
    () =>
      budgets.filter((item) => {
        const parent = item.monthlyBudget;

        if (!parent) return false;

        const parentId =
          typeof parent === "object" ? parent._id : parent;

        return (
          String(parentId) ===
          String(selectedMonthlyBudget?._id)
        );
      }),
    [budgets, selectedMonthlyBudget]
  );

  const totalBudget = Number(
    selectedMonthlyBudget?.totalAmount || 0
  );

  const allocatedAmount = selectedCategoryBudgets.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const unallocatedAmount = Math.max(
    0,
    totalBudget - allocatedAmount
  );

  const monthKey = selectedMonthlyBudget
    ? getMonthKey(
        selectedMonthlyBudget.year,
        selectedMonthlyBudget.month
      )
    : selectedMonthKey;

  const actualSpending = Number(
    analytics.monthlyBudgetActual?.[monthKey] ??
      analytics.monthlyExpenses?.[monthKey] ??
      0
  );

  const spendingRemaining = totalBudget - actualSpending;

  const budgetUsage =
    totalBudget > 0
      ? (actualSpending / totalBudget) * 100
      : 0;

  const categoryNames = selectedCategoryBudgets.map(
    (item) => item.category
  );

 

  // =====================================================
  // MONTHLY FORM
  // =====================================================

  const handleMonthlyChange = (event) => {
    const { name, value } = event.target;

    setMonthlyForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openMonthlyForm = () => {
    setError("");
    setSuccess("");

    if (selectedMonthlyBudget) {
      setEditingMonthlyId(selectedMonthlyBudget._id);

      setMonthlyForm({
        totalAmount: String(
          selectedMonthlyBudget.totalAmount
        ),
        month: selectedMonthlyBudget.month,
        year: selectedMonthlyBudget.year,
      });
    } else {
      setEditingMonthlyId(null);

      const [year, month] = selectedMonthKey
        .split("-")
        .map(Number);

      setMonthlyForm({
        totalAmount: "",
        month,
        year,
      });
    }

    setShowMonthlyForm(true);
    setShowCategoryForm(false);
    setEditingCategoryId(null);
  };

  const cancelMonthlyForm = () => {
    setShowMonthlyForm(false);
    setEditingMonthlyId(null);
    setMonthlyForm(getInitialMonthlyForm());
  };

  const handleMonthlySubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const amount = Number(monthlyForm.totalAmount);
    const month = Number(monthlyForm.month);
    const year = Number(monthlyForm.year);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a monthly budget greater than zero.");
      return;
    }

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      setError("Select a valid month.");
      return;
    }

    if (
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      setError("Enter a year between 2000 and 2100.");
      return;
    }

    if (editingMonthlyId && amount < allocatedAmount) {
      setError(
        `The monthly budget cannot be below the allocated amount of ${formatCurrency(
          allocatedAmount
        )}.`
      );
      return;
    }

    setSubmitting(true);

    try {
      if (editingMonthlyId) {
        await updateMonthlyBudget(editingMonthlyId, {
          totalAmount: amount,
        });

        setSuccess("Monthly budget updated successfully.");
      } else {
        await addMonthlyBudget({
          totalAmount: amount,
          month,
          year,
        });

        setSelectedMonthKey(getMonthKey(year, month));
        setSuccess("Monthly budget created successfully.");
      }

      cancelMonthlyForm();
      await loadData(false);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to save the monthly budget."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // CATEGORY FORM
  // =====================================================

  const openCategoryForm = (budget = null) => {
    setError("");
    setSuccess("");

    if (!selectedMonthlyBudget) {
      setError("Create a monthly budget before adding categories.");
      return;
    }

    if (budget) {
      setEditingCategoryId(budget._id);

      setCategoryForm({
        category: budget.category,
        amount: String(budget.amount),
      });
    } else {
      setEditingCategoryId(null);
      setCategoryForm(getInitialCategoryForm());
    }

    setShowCategoryForm(true);
    setShowMonthlyForm(false);
    setEditingMonthlyId(null);
  };

  const cancelCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategoryId(null);
    setCategoryForm(getInitialCategoryForm());
  };

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;

    setCategoryForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const categoryAvailableAmount = editingCategoryId
    ? unallocatedAmount +
      Number(
        selectedCategoryBudgets.find(
          (item) => item._id === editingCategoryId
        )?.amount || 0
      )
    : unallocatedAmount;

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedMonthlyBudget) {
      setError("Create a monthly budget first.");
      return;
    }

    const category = categoryForm.category.trim();
    const amount = Number(categoryForm.amount);

    if (!category) {
      setError("Select a category.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a category budget greater than zero.");
      return;
    }

    if (amount > categoryAvailableAmount) {
      setError(
        `Only ${formatCurrency(
          categoryAvailableAmount
        )} is available to allocate.`
      );
      return;
    }

    const duplicate = selectedCategoryBudgets.some(
      (item) =>
        item.category.toLowerCase() === category.toLowerCase() &&
        item._id !== editingCategoryId
    );

    if (duplicate) {
      setError("This category already has a budget for this month.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingCategoryId) {
        await updateCategoryBudget(editingCategoryId, {
          category,
          amount,
        });

        setSuccess("Category budget updated successfully.");
      } else {
        await addCategoryBudget({
          monthlyBudgetId: selectedMonthlyBudget._id,
          category,
          amount,
        });

        setSuccess("Category budget added successfully.");
      }

      cancelCategoryForm();
      await loadData(false);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to save the category budget."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // DELETE ACTIONS
  // =====================================================

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      if (deleteTarget.type === "monthly") {
        await deleteMonthlyBudget(deleteTarget.item._id);
        setSuccess("Monthly budget deleted successfully.");
      } else {
        await deleteCategoryBudget(deleteTarget.item._id);
        setSuccess("Category budget deleted successfully.");
      }

      setDeleteTarget(null);
      await loadData(false);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to delete the budget."
        )
      );
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <Loading />;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="budget-page">
      <div className="budget-page-header">
        <div>
          <p className="budget-eyebrow">SMART MONEY PLANNING</p>
          <h1>Monthly Budget</h1>
          <p>
            Set a monthly limit, divide it between categories,
            and compare your plan with actual spending.
          </p>
        </div>

        <div className="budget-month-selector">
          <label htmlFor="budget-month-select">
            View month
          </label>

          <select
            id="budget-month-select"
            value={selectedMonthKey}
            onChange={(event) => {
              setSelectedMonthKey(event.target.value);
              setError("");
              setSuccess("");
              setShowMonthlyForm(false);
              setShowCategoryForm(false);
            }}
          >
            {Array.from(
              new Map(
                [
                  ...monthlyBudgets.map((item) => ({
                    year: Number(item.year),
                    month: Number(item.month),
                  })),
                  {
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth() + 1,
                  },
                ].map((item) => [
                  getMonthKey(item.year, item.month),
                  item,
                ])
              ).values()
            )
              .sort(
                (a, b) =>
                  b.year - a.year || b.month - a.month
              )
              .map((item) => {
                const key = getMonthKey(item.year, item.month);

                return (
                  <option key={key} value={key}>
                    {MONTHS[item.month - 1]} {item.year}
                  </option>
                );
              })}
          </select>
        </div>
      </div>

      {error && (
        <div className="budget-alert budget-alert-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div
          className="budget-alert budget-alert-success"
          role="status"
          aria-live="polite"
        >
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}

      {/* MONTHLY BUDGET */}

      <section className="budget-monthly-panel">
        <div className="budget-section-heading">
          <div>
            <h2>
              {MONTHS[Number(selectedMonthKey.split("-")[1]) - 1]}{" "}
              {selectedMonthKey.split("-")[0]}
            </h2>
            <p>Your total spending limit for this month.</p>
          </div>

          <div className="budget-heading-actions">
            {selectedMonthlyBudget && (
              <button
                type="button"
                className="budget-button budget-button-secondary"
                onClick={openMonthlyForm}
              >
                Edit monthly budget
              </button>
            )}

            {!selectedMonthlyBudget && (
              <button
                type="button"
                className="budget-button budget-button-primary"
                onClick={openMonthlyForm}
              >
                + Set monthly budget
              </button>
            )}
          </div>
        </div>

        {selectedMonthlyBudget ? (
          <>
            <div className="budget-total-value">
              {formatCurrency(totalBudget)}
            </div>

            <div className="budget-summary-grid">
              <div className="budget-summary-card">
                <span>Allocated to categories</span>
                <strong>{formatCurrency(allocatedAmount)}</strong>
                <small>
                  {totalBudget > 0
                    ? `${((allocatedAmount / totalBudget) * 100).toFixed(1)}% of monthly budget`
                    : "0% allocated"}
                </small>
              </div>

              <div className="budget-summary-card">
                <span>Unallocated funds</span>
                <strong>{formatCurrency(unallocatedAmount)}</strong>
                <small>Available for new category budgets</small>
              </div>

              <div className="budget-summary-card">
                <span>Actual spending</span>
                <strong>{formatCurrency(actualSpending)}</strong>
                <small>Recorded expenses this month</small>
              </div>

              <div className="budget-summary-card">
                <span>Monthly limit remaining</span>
                <strong
                  className={
                    spendingRemaining < 0
                      ? "budget-value-danger"
                      : ""
                  }
                >
                  {formatCurrency(spendingRemaining)}
                </strong>
                <small>
                  {spendingRemaining < 0
                    ? "Spending is above the monthly limit"
                    : "Based on actual expenses"}
                </small>
              </div>
            </div>

            <div className="budget-progress-section">
              <div className="budget-progress-labels">
                <span>Monthly spending progress</span>
                <strong>{budgetUsage.toFixed(1)}%</strong>
              </div>

              <div
                className="budget-progress-track"
                role="progressbar"
                aria-label="Monthly spending progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(100, Math.max(0, budgetUsage))}
              >
                <div
                  className={`budget-progress-fill ${
                    budgetUsage > 100 ? "is-over-budget" : ""
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, budgetUsage))}%`,
                  }}
                />
              </div>

              <p>
                {budgetUsage > 100
                  ? `You have exceeded the monthly limit by ${formatCurrency(
                      actualSpending - totalBudget
                    )}.`
                  : `${formatCurrency(
                      Math.max(0, totalBudget - actualSpending)
                    )} remains before reaching your monthly limit.`}
              </p>
            </div>

            <div className="budget-monthly-actions">
              <button
                type="button"
                className="budget-button budget-button-danger-outline"
                onClick={() =>
                  setDeleteTarget({
                    type: "monthly",
                    item: selectedMonthlyBudget,
                  })
                }
                disabled={selectedCategoryBudgets.length > 0}
                title={
                  selectedCategoryBudgets.length > 0
                    ? "Delete category budgets first"
                    : "Delete monthly budget"
                }
              >
                Delete monthly budget
              </button>

              {selectedCategoryBudgets.length > 0 && (
                <span className="budget-helper-text">
                  Delete all category budgets before deleting this month.
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="budget-no-monthly">
            <h3>No monthly budget set</h3>
            <p>
              Set a total limit for this month before allocating
              amounts to Food, Shopping, Transport, and other categories.
            </p>
            <button
              type="button"
              className="budget-button budget-button-primary"
              onClick={openMonthlyForm}
            >
              Create monthly budget
            </button>
          </div>
        )}
      </section>

      {/* MONTHLY FORM */}

      {showMonthlyForm && (
        <section className="budget-form-panel">
          <div className="budget-section-heading">
            <div>
              <h2>
                {editingMonthlyId
                  ? "Edit monthly budget"
                  : "Create monthly budget"}
              </h2>
              <p>
                Your category allocations cannot exceed this amount.
              </p>
            </div>

            <button
              type="button"
              className="budget-close-button"
              onClick={cancelMonthlyForm}
              aria-label="Close monthly budget form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleMonthlySubmit}>
            <div className="budget-form-grid">
              <div className="form-group">
                <label htmlFor="monthly-total">
                  Total monthly budget (₹)
                </label>
                <input
                  id="monthly-total"
                  name="totalAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  value={monthlyForm.totalAmount}
                  onChange={handleMonthlyChange}
                  placeholder="30000"
                  required
                />
              </div>

              {!editingMonthlyId && (
                <>
                  <div className="form-group">
                    <label htmlFor="monthly-month">Month</label>
                    <select
                      id="monthly-month"
                      name="month"
                      value={monthlyForm.month}
                      onChange={handleMonthlyChange}
                      required
                    >
                      {MONTHS.map((month, index) => (
                        <option key={month} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="monthly-year">Year</label>
                    <input
                      id="monthly-year"
                      name="year"
                      type="number"
                      min="2000"
                      max="2100"
                      value={monthlyForm.year}
                      onChange={handleMonthlyChange}
                      required
                    />
                  </div>
                </>
              )}
            </div>

            {editingMonthlyId && (
              <p className="budget-helper-text">
                Currently allocated: {formatCurrency(allocatedAmount)}.
                The new monthly total cannot be lower than this amount.
              </p>
            )}

            <div className="budget-form-actions">
              <button
                type="button"
                className="budget-button budget-button-secondary"
                onClick={cancelMonthlyForm}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="budget-button budget-button-primary"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editingMonthlyId
                    ? "Save changes"
                    : "Create monthly budget"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* CATEGORY BUDGETS */}

      <section className="budget-category-section">
        <div className="budget-section-heading">
          <div>
            <h2>Category budgets</h2>
            <p>
              Divide your monthly budget into spending categories.
            </p>
          </div>

          <button
            type="button"
            className="budget-button budget-button-primary"
            onClick={() => openCategoryForm()}
            disabled={!selectedMonthlyBudget || unallocatedAmount <= 0}
          >
            + Add category
          </button>
        </div>

        {selectedMonthlyBudget && (
          <div className="budget-allocation-banner">
            <div>
              <span>Available to allocate</span>
              <strong>{formatCurrency(unallocatedAmount)}</strong>
            </div>
            <p>
              Category allocations must stay within the monthly total of{" "}
              {formatCurrency(totalBudget)}.
            </p>
          </div>
        )}

        {/* CATEGORY FORM */}

        {showCategoryForm && (
          <div className="budget-form-panel">
            <div className="budget-section-heading">
              <div>
                <h3>
                  {editingCategoryId
                    ? "Edit category budget"
                    : "Add category budget"}
                </h3>
                <p>
                  Available allocation:{" "}
                  <strong>
                    {formatCurrency(categoryAvailableAmount)}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="budget-close-button"
                onClick={cancelCategoryForm}
                aria-label="Close category budget form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCategorySubmit}>
              <div className="budget-form-grid">
                <div className="form-group">
                  <label htmlFor="category-name">Category</label>
                  <select
                    id="category-name"
                    name="category"
                    value={categoryForm.category}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">Select a category</option>

                    {categoryForm.category &&
                      !CATEGORIES.includes(categoryForm.category) && (
                        <option value={categoryForm.category}>
                          {categoryForm.category}
                        </option>
                      )}

                    {CATEGORIES.filter(
                      (category) =>
                        category === categoryForm.category ||
                        !categoryNames.some(
                          (existing) =>
                            existing.toLowerCase() ===
                            category.toLowerCase()
                        )
                    ).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category-amount">
                    Category budget (₹)
                  </label>
                  <input
                    id="category-amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    max={categoryAvailableAmount}
                    step="0.01"
                    inputMode="decimal"
                    value={categoryForm.amount}
                    onChange={handleCategoryChange}
                    placeholder="5000"
                    required
                  />
                </div>
              </div>

              <p className="budget-helper-text">
                This allocation is separate from actual expenses.
                You can change it later as long as the total remains
                within the monthly limit.
              </p>

              <div className="budget-form-actions">
                <button
                  type="button"
                  className="budget-button budget-button-secondary"
                  onClick={cancelCategoryForm}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="budget-button budget-button-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : editingCategoryId
                      ? "Save category"
                      : "Add category"}
                </button>
              </div>
            </form>
          </div>
        )}

        {!selectedMonthlyBudget ? (
          <EmptyState
            title="Set a monthly budget first"
            message="Once you create a monthly budget, you can allocate amounts to individual categories."
          />
        ) : selectedCategoryBudgets.length === 0 ? (
          <EmptyState
            title="No category budgets yet"
            message="Start by allocating part of your monthly budget to Food, Shopping, Transport, or another category."
          />
        ) : (
          <div className="budget-category-grid">
            {selectedCategoryBudgets.map((budget) => {
              const categoryAmount = Number(budget.amount) || 0;

              const categoryActual = Number(
                analytics.budgetActual?.[budget.category] || 0
              );

              const categoryRemaining =
                categoryAmount - categoryActual;

              const categoryUsage =
                categoryAmount > 0
                  ? (categoryActual / categoryAmount) * 100
                  : 0;

              return (
                <article
                  className="budget-category-card"
                  key={budget._id}
                >
                  <div className="budget-category-card-header">
                    <div>
                      <span className="budget-category-label">
                        CATEGORY
                      </span>
                      <h3>{budget.category}</h3>
                    </div>

                    <div className="budget-card-actions">
                      <button
                        type="button"
                        className="budget-icon-button"
                        onClick={() => openCategoryForm(budget)}
                        aria-label={`Edit ${budget.category} budget`}
                        title="Edit category budget"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        className="budget-icon-button budget-icon-danger"
                        onClick={() =>
                          setDeleteTarget({
                            type: "category",
                            item: budget,
                          })
                        }
                        aria-label={`Delete ${budget.category} budget`}
                        title="Delete category budget"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="budget-category-amount">
                    {formatCurrency(categoryAmount)}
                  </div>

                  <div className="budget-category-metrics">
                    <div>
                      <span>Spent</span>
                      <strong>{formatCurrency(categoryActual)}</strong>
                    </div>

                    <div>
                      <span>Remaining</span>
                      <strong
                        className={
                          categoryRemaining < 0
                            ? "budget-value-danger"
                            : ""
                        }
                      >
                        {formatCurrency(categoryRemaining)}
                      </strong>
                    </div>
                  </div>

                  <div className="budget-progress-section">
                    <div className="budget-progress-labels">
                      <span>Budget used</span>
                      <strong>{categoryUsage.toFixed(1)}%</strong>
                    </div>

                    <div
                      className="budget-progress-track"
                      role="progressbar"
                      aria-label={`${budget.category} budget used`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.min(
                        100,
                        Math.max(0, categoryUsage)
                      )}
                    >
                      <div
                        className={`budget-progress-fill ${
                          categoryUsage > 100 ? "is-over-budget" : ""
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, categoryUsage)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {categoryUsage > 100 && (
                    <p className="budget-category-warning" role="status">
                      Over category limit by{" "}
                      {formatCurrency(
                        categoryActual - categoryAmount
                      )}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* CONFIRMATION DIALOG */}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={
          deleteTarget?.type === "monthly"
            ? "Delete monthly budget?"
            : "Delete category budget?"
        }
        message={
          deleteTarget?.type === "monthly"
            ? "This will permanently delete the monthly budget. You can only delete it after removing its category budgets."
            : `Delete the ${
                deleteTarget?.item?.category || ""
              } budget? This will return its allocation to the unallocated amount. Your recorded expenses will not be deleted.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        loading={deleting}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
      />
    </main>
  );
};

export default Budget;