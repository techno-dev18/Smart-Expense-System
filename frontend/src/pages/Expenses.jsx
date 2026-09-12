import { useEffect, useState } from "react";

import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../services/expenseApi";

const Expenses = () => {
  const initialForm = {
    category: "",
    amount: "",
    description: "",
    date: "",
    paymentMethod: "Cash",
  };

  const [formData, setFormData] = useState(initialForm);

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);


  // Load expenses
  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();

      setExpenses(data.expenses || []);
    } catch (error) {
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


  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // Add / Update expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

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

      if (editingId) {
        await updateExpense(editingId, {
          ...formData,
          amount: Number(formData.amount),
        });

        setSuccess("Expense updated successfully.");
      } else {
        await addExpense({
          ...formData,
          amount: Number(formData.amount),
        });

        setSuccess("Expense added successfully.");
      }

      setFormData(initialForm);
      setEditingId(null);

      await loadExpenses();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };


  // Edit expense
  const handleEdit = (expense) => {
    setEditingId(expense._id);

    setFormData({
      category: expense.category,
      amount: expense.amount,
      description: expense.description || "",
      date: expense.date
        ? expense.date.substring(0, 10)
        : "",
      paymentMethod: expense.paymentMethod || "Cash",
    });

    setError("");
    setSuccess("");
  };


  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
  };


  // Delete expense
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
      setError(
        error.response?.data?.message ||
          "Failed to delete expense."
      );
    }
  };


  return (
    <div className="expenses-page">

      <h1>Expenses</h1>

      <p>
        Track and manage your daily expenses.
      </p>


      {/* Messages */}

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


      {/* Expense Form */}

      <div className="expense-form-container">

        <h2>
          {editingId
            ? "Edit Expense"
            : "Add Expense"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div>
            <label>Category</label>

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


          <div>
            <label>Amount</label>

            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="1"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>


          <div>
            <label>Description</label>

            <input
              type="text"
              name="description"
              placeholder="e.g. Lunch with friends"
              value={formData.description}
              onChange={handleChange}
            />
          </div>


          <div>
            <label>Date</label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>


          <div>
            <label>Payment Method</label>

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
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}

        </form>
      </div>


      {/* Expense List */}

      <div className="expense-list">

        <h2>Your Expenses</h2>

        {loading ? (
          <p>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p>
            No expenses found. Add your first expense.
          </p>
        ) : (
          expenses.map((expense) => (
            <div
              className="expense-card"
              key={expense._id}
            >

              <div>
                <h3>{expense.category}</h3>

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


              <div>
                <h3>
                  ₹{Number(expense.amount).toLocaleString("en-IN")}
                </h3>

                <button
                  onClick={() =>
                    handleEdit(expense)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(expense._id)
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