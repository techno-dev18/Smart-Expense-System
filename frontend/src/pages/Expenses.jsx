import { useCallback, useEffect, useState } from "react";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ExpenseCard from "../components/ExpenseCard";


import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../services/expenseApi";

import "../styles/expenses.css";

const getToday = () => {
  return new Date().toLocaleDateString("en-CA");
};

const createInitialForm = () => ({
  category: "",
  amount: "",
  description: "",
  date: getToday(),
  paymentMethod: "Cash",
});

const Expenses = () => {
  const [formData, setFormData] = useState(
    createInitialForm()
  );

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  /*
   * Load expenses
   *
   * `showLoading` allows us to distinguish between:
   * - the first page load
   * - a manual refresh after the page is already loaded
   */
  const loadExpenses = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const data = await getExpenses();

      setExpenses(data?.expenses || []);
    } catch (error) {
      console.error("Expenses Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load expenses."
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  /*
   * Initial data load
   *
   * Loading already starts as true, so we don't need
   * to synchronously call setLoading(true) here.
   */
  useEffect(() => {
    let cancelled = false;

    const fetchInitialExpenses = async () => {
      try {
        setError("");

        const data = await getExpenses();

        if (!cancelled) {
          setExpenses(data?.expenses || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Expenses Error:", error);

          setError(
            error.response?.data?.message ||
              "Failed to load expenses."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitialExpenses();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const amount = Number(formData.amount);

    if (!formData.category) {
      return "Please select an expense category.";
    }

    if (
      formData.amount === "" ||
      formData.amount === null
    ) {
      return "Amount is required.";
    }

    if (!Number.isFinite(amount)) {
      return "Please enter a valid amount.";
    }

    if (amount <= 0) {
      return "Amount must be greater than 0.";
    }

    if (amount > 100000000) {
      return "Amount is too large.";
    }

    if (formData.description.length > 200) {
      return "Description cannot exceed 200 characters.";
    }

    if (!formData.date) {
      return "Date is required.";
    }

    if (
      Number.isNaN(
        new Date(formData.date).getTime()
      )
    ) {
      return "Please enter a valid date.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const data = {
        category: formData.category,
        amount: Number(formData.amount),
        description: formData.description.trim(),
        date: formData.date,
        paymentMethod: formData.paymentMethod,
      };

      if (editingId) {
        await updateExpense(editingId, data);

        setSuccess(
          "Expense updated successfully."
        );
      } else {
        await addExpense(data);

        setSuccess(
          "Expense added successfully."
        );
      }

      setFormData(createInitialForm());

      setEditingId(null);

      await loadExpenses(false);
    } catch (error) {
      console.error(
        "Save Expense Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Something went wrong while saving the expense."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);

    setFormData({
      category: expense.category || "",

      amount:
        expense.amount !== undefined &&
        expense.amount !== null
          ? expense.amount
          : "",

      description: expense.description || "",

      date: expense.date
        ? expense.date.substring(0, 10)
        : getToday(),

      paymentMethod:
        expense.paymentMethod || "Cash",
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

    setFormData(createInitialForm());

    setError("");
    setSuccess("");
  };

  /*
   * Open delete confirmation modal
   */
  const requestDelete = (expense) => {
    setDeleteTarget(expense);

    setError("");
    setSuccess("");
  };

  /*
   * Cancel delete confirmation
   */
  const cancelDelete = () => {
    if (deleting) {
      return;
    }

    setDeleteTarget(null);
  };

  /*
   * Confirm deletion
   */
  const handleDelete = async () => {
    if (!deleteTarget?._id) {
      return;
    }

    try {
      setDeleting(true);

      setError("");
      setSuccess("");

      await deleteExpense(deleteTarget._id);

      setDeleteTarget(null);

      setSuccess(
        "Expense deleted successfully."
      );

      await loadExpenses(false);
    } catch (error) {
      console.error(
        "Delete Expense Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete expense."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="expenses-page">
        <Loading message="Loading expenses..." />
      </div>
    );
  }

  if (error && expenses.length === 0) {
    return (
      <div className="expenses-page">
        <ErrorState
          title="Unable to load expenses"
          message={error}
          actionText="Try Again"
          onAction={() => loadExpenses(true)}
        />
      </div>
    );
  }

  return (
    <div className="expenses-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Expenses</h1>

          <p>
            Track and manage your daily expenses.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="error-message"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          className="success-message"
          role="status"
          aria-live="polite"
        >
          {success}
        </div>
      )}

      {/* Expense Form */}
      <div className="expense-form-container">

        <h2>
          {editingId
            ? "Edit Expense"
            : "Add Expense"}
        </h2>

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Category */}
          <div>
            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={
                Boolean(error) &&
                !formData.category
              }
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

          {/* Amount */}
          <div>
            <label htmlFor="amount">
              Amount
            </label>

            <input
              id="amount"
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="0.01"
              max="100000000"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description">
              Description
            </label>

            <input
              id="description"
              type="text"
              name="description"
              placeholder="e.g. Lunch with friends"
              maxLength="200"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">
              Date
            </label>

            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod">
              Payment Method
            </label>

            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash">
                Cash
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="Credit Card">
                Credit Card
              </option>

              <option value="Debit Card">
                Debit Card
              </option>

              <option value="Bank Transfer">
                Bank Transfer
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="form-actions">

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Expense"
                : "Add Expense"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* Expense List */}
      <div className="expense-list">

        <h2>Your Expenses</h2>

        {expenses.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            message="You haven't added any expenses. Start tracking your spending to understand where your money goes."
            actionText="Add Your First Expense"
            onAction={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        ) : (
          <div className="expense-items">

            {expenses.map((expense) => (
              <ExpenseCard
                key={expense._id}
                expense={expense}
                onEdit={handleEdit}
                onDelete={() =>
                  requestDelete(expense)
                }
              />
            ))}

          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete expense?"
        message={
          deleteTarget
            ? `Are you sure you want to delete this ${deleteTarget.category || "expense"} expense? This action cannot be undone.`
            : ""
        }
        confirmText={
          deleting
            ? "Deleting..."
            : "Delete Expense"
        }
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        loading={deleting}
        danger
      />

    </div>
  );
};

export default Expenses;