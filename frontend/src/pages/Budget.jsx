import { useEffect, useState } from "react";

import {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../services/budgetApi";

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

  const [budgets, setBudgets] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] =
    useState(null);


  // Load budgets
  const loadBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBudgets();

      setBudgets(data.budgets || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load budgets."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadBudgets();
  }, []);


  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.category ||
      !formData.amount ||
      !formData.month ||
      !formData.year
    ) {
      setError(
        "Please fill all required fields."
      );

      return;
    }

    if (Number(formData.amount) <= 0) {
      setError(
        "Budget amount must be greater than 0."
      );

      return;
    }

    try {
      setSubmitting(true);

      const data = {
        category: formData.category,
        amount: Number(formData.amount),
        month: Number(formData.month),
        year: Number(formData.year),
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
          "Budget created successfully."
        );
      }

      setFormData(initialForm);
      setEditingId(null);

      await loadBudgets();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };


  // Edit
  const handleEdit = (budget) => {
    setEditingId(budget._id);

    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    });

    setError("");
    setSuccess("");
  };


  // Cancel
  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData(initialForm);

    setError("");
    setSuccess("");
  };


  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
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

      await loadBudgets();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete budget."
      );
    }
  };


  const getMonthName = (month) => {
    return new Date(
      2000,
      month - 1,
      1
    ).toLocaleString("en-IN", {
      month: "long",
    });
  };


  return (
    <div className="budget-page">

      <h1>Budgets</h1>

      <p>
        Set spending limits for different
        categories.
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


      {/* Budget Form */}

      <div className="budget-form-container">

        <h2>
          {editingId
            ? "Edit Budget"
            : "Create Budget"}
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
            <label>Budget Amount</label>

            <input
              type="number"
              name="amount"
              min="1"
              placeholder="Enter budget"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>


          <div>
            <label>Month</label>

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


          <div>
            <label>Year</label>

            <input
              type="number"
              name="year"
              min="2020"
              max="2100"
              value={formData.year}
              onChange={handleChange}
            />
          </div>


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
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}

        </form>
      </div>


      {/* Budget List */}

      <div className="budget-list">

        <h2>Your Budgets</h2>

        {loading ? (
          <p>Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <p>
            No budgets found. Create your
            first budget.
          </p>
        ) : (
          budgets.map((budget) => (
            <div
              className="budget-card"
              key={budget._id}
            >

              <div>
                <h3>
                  {budget.category}
                </h3>

                <p>
                  {getMonthName(
                    budget.month
                  )}{" "}
                  {budget.year}
                </p>
              </div>


              <div>
                <h3>
                  ₹
                  {Number(
                    budget.amount
                  ).toLocaleString(
                    "en-IN"
                  )}
                </h3>

                <button
                  onClick={() =>
                    handleEdit(budget)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      budget._id
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

export default Budget;