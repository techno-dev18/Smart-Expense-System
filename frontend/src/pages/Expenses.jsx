
import { useEffect, useState } from "react";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../services/expenseApi";

import "../styles/expenses.css";

const Expenses = () => {
  // =========================================
  // INITIAL FORM
  // =========================================

  const initialForm = {
    category: "",
    amount: "",
    description: "",
    date: "",
    paymentMethod: "Cash",
  };

  // =========================================
  // STATES
  // =========================================

  const [formData, setFormData] = useState(initialForm);

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  // =========================================
  // LOAD EXPENSES
  // =========================================

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();

      setExpenses(data.expenses || []);
    } catch (error) {
      console.error("Expenses Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load expenses."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD DATA ON PAGE OPEN
  // =========================================

  useEffect(() => {
    loadExpenses();
  }, []);

  // =========================================
  // HANDLE INPUT CHANGES
  // =========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // ADD / UPDATE EXPENSE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation

    if (!formData.category || !formData.amount) {
      setError("Category and amount are required.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    try {
      setSubmitting(true);

      // UPDATE

      if (editingId) {
        await updateExpense(editingId, {
          ...formData,
          amount: Number(formData.amount),
        });

        setSuccess("Expense updated successfully.");
      }

      // ADD

      else {
        await addExpense({
          ...formData,
          amount: Number(formData.amount),
        });

        setSuccess("Expense added successfully.");
      }

      // Reset form

      setFormData(initialForm);

      setEditingId(null);

      // Reload expenses

      await loadExpenses();

    } catch (error) {
      console.error("Save Expense Error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================
  // EDIT EXPENSE
  // =========================================

  const handleEdit = (expense) => {
    setEditingId(expense._id);

    setFormData({
      category: expense.category,
      amount: expense.amount,
      description: expense.description || "",

      date: expense.date
        ? expense.date.substring(0, 10)
        : "",

      paymentMethod:
        expense.paymentMethod || "Cash",
    });

    setError("");
    setSuccess("");
  };

  // =========================================
  // CANCEL EDIT
  // =========================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData(initialForm);

    setError("");
    setSuccess("");
  };

  // =========================================
  // DELETE EXPENSE
  // =========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteExpense(id);

      setSuccess("Expense deleted successfully.");

      await loadExpenses();

    } catch (error) {
      console.error("Delete Expense Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete expense."
      );
    }
  };

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <div className="expenses-page">
        <Loading message="Loading expenses..." />
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="expenses-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <h1>Expenses</h1>

      <p>
        Track and manage your daily expenses.
      </p>


      {/* =====================================
          MESSAGES
      ====================================== */}

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


      {/* =====================================
          EXPENSE FORM
      ====================================== */}

      <div className="expense-form-container">

        <h2>
          {editingId
            ? "Edit Expense"
            : "Add Expense"}
        </h2>


        <form onSubmit={handleSubmit}>

          {/* Category */}

          <div>

            <label>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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

            <label>
              Amount
            </label>

            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="1"
              value={formData.amount}
              onChange={handleChange}
            />

          </div>


          {/* Description */}

          <div>

            <label>
              Description
            </label>

            <input
              type="text"
              name="description"
              placeholder="e.g. Lunch with friends"
              value={formData.description}
              onChange={handleChange}
            />

          </div>


          {/* Date */}

          <div>

            <label>
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

          </div>


          {/* Payment Method */}

          <div>

            <label>
              Payment Method
            </label>

            <select
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


          {/* Submit */}

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


          {/* Cancel Edit */}

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}

        </form>

      </div>


      {/* =====================================
          EXPENSE LIST
      ====================================== */}

      <div className="expense-list">

        <h2>
          Your Expenses
        </h2>


        {/* EMPTY STATE */}

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

          /* EXPENSES */

          expenses.map((expense) => (

            <div
              className="expense-card"
              key={expense._id}
            >

              {/* Expense Information */}

              <div>

                <h3>
                  {expense.category}
                </h3>

                <p>
                  {expense.description ||
                    "No description"}
                </p>

                <small>
                  {new Date(
                    expense.date
                  ).toLocaleDateString()}
                </small>

                <small>
                  {" "}
                  • {expense.paymentMethod}
                </small>

              </div>


              {/* Amount + Actions */}

              <div>

                <h3>
                  ₹
                  {Number(
                    expense.amount
                  ).toLocaleString("en-IN")}
                </h3>


                <button
                  type="button"
                  onClick={() =>
                    handleEdit(expense)
                  }
                >
                  Edit
                </button>


                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      expense._id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default Expenses;

