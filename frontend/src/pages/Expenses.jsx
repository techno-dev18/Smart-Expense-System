import { useEffect, useState } from "react";

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

const Expenses = () => {
  const initialForm = {
    category: "",
    amount: "",
    description: "",
    date: "",
    paymentMethod: "Cash",
  };

  const [formData, setFormData] =
    useState(initialForm);

  const [expenses, setExpenses] =
    useState([]);

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

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();

      setExpenses(
        data.expenses || []
      );
    } catch (error) {
      console.error(
        "Expenses Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load expenses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
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

    if (
      formData.description.length > 200
    ) {
      return "Description cannot exceed 200 characters.";
    }

    if (
      formData.date &&
      Number.isNaN(
        new Date(
          formData.date
        ).getTime()
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

        description:
          formData.description.trim(),

        date:
          formData.date,

        paymentMethod:
          formData.paymentMethod,
      };

      if (editingId) {
        await updateExpense(
          editingId,
          data
        );

        setSuccess(
          "Expense updated successfully."
        );
      } else {
        await addExpense(data);

        setSuccess(
          "Expense added successfully."
        );
      }

      setFormData(initialForm);
      setEditingId(null);

      await loadExpenses();
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
    setEditingId(
      expense._id
    );

    setFormData({
      category:
        expense.category || "",

      amount:
        expense.amount || "",

      description:
        expense.description || "",

      date: expense.date
        ? expense.date.substring(
            0,
            10
          )
        : "",

      paymentMethod:
        expense.paymentMethod ||
        "Cash",
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
    setFormData(initialForm);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this expense?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteExpense(id);

      setSuccess(
        "Expense deleted successfully."
      );

      await loadExpenses();
    } catch (error) {
      console.error(
        "Delete Expense Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete expense."
      );
    }
  };

  if (loading) {
    return (
      <div className="expenses-page">
        <Loading
          message="Loading expenses..."
        />
      </div>
    );
  }

  if (
    error &&
    expenses.length === 0
  ) {
    return (
      <div className="expenses-page">
        <ErrorState
          title="Unable to load expenses"
          message={error}
          actionText="Try Again"
          onAction={loadExpenses}
        />
      </div>
    );
  }

  return (
    <div className="expenses-page">

      <div className="page-header">

        <div>

          <h1>
            Expenses
          </h1>

          <p>
            Track and manage your
            daily expenses.
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

            <label htmlFor="description">
              Description
            </label>

            <input
              id="description"
              type="text"
              name="description"
              placeholder="e.g. Lunch with friends"
              maxLength="200"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div>

            <label htmlFor="date">
              Date
            </label>

            <input
              id="date"
              type="date"
              name="date"
              value={
                formData.date
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div>

            <label htmlFor="paymentMethod">
              Payment Method
            </label>

            <select
              id="paymentMethod"
              name="paymentMethod"
              value={
                formData.paymentMethod
              }
              onChange={
                handleChange
              }
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

          <div className="form-actions">

            <button
              type="submit"
              disabled={submitting}
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

      <div className="expense-list">

        <h2>
          Your Expenses
        </h2>

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

            {expenses.map(
              (expense) => (
                <ExpenseCard
                  key={
                    expense._id
                  }
                  expense={
                    expense
                  }
                  onEdit={
                    handleEdit
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default Expenses;