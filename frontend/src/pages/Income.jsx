import { useEffect, useState } from "react";

import {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
} from "../services/incomeApi";

const Income = () => {
  const initialForm = {
    source: "",
    amount: "",
    description: "",
    date: "",
    paymentMethod: "Bank Transfer",
  };

  const [formData, setFormData] = useState(initialForm);

  const [income, setIncome] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);


  // Load income
  const loadIncome = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getIncome();

      setIncome(data.income || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load income."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadIncome();
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

    if (!formData.source || !formData.amount) {
      setError("Source and amount are required.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    try {
      setSubmitting(true);

      const data = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (editingId) {
        await updateIncome(editingId, data);

        setSuccess(
          "Income updated successfully."
        );
      } else {
        await addIncome(data);

        setSuccess(
          "Income added successfully."
        );
      }

      setFormData(initialForm);
      setEditingId(null);

      await loadIncome();
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
  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      source: item.source,
      amount: item.amount,
      description: item.description || "",
      date: item.date
        ? item.date.substring(0, 10)
        : "",
      paymentMethod:
        item.paymentMethod || "Bank Transfer",
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


  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this income?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteIncome(id);

      setSuccess(
        "Income deleted successfully."
      );

      await loadIncome();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete income."
      );
    }
  };


  return (
    <div className="income-page">

      <h1>Income</h1>

      <p>
        Track and manage your sources of income.
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


      {/* Income Form */}

      <div className="income-form-container">

        <h2>
          {editingId
            ? "Edit Income"
            : "Add Income"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div>
            <label>Income Source</label>

            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="">
                Select Source
              </option>

              <option value="Salary">
                Salary
              </option>

              <option value="Freelance">
                Freelance
              </option>

              <option value="Business">
                Business
              </option>

              <option value="Investment">
                Investment
              </option>

              <option value="Bonus">
                Bonus
              </option>

              <option value="Gift">
                Gift
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
              placeholder="e.g. September salary"
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
              <option value="Bank Transfer">
                Bank Transfer
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="Cash">
                Cash
              </option>

              <option value="Cheque">
                Cheque
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
              ? "Update Income"
              : "Add Income"}
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


      {/* Income List */}

      <div className="income-list">

        <h2>Your Income</h2>

        {loading ? (
          <p>Loading income...</p>
        ) : income.length === 0 ? (
          <p>
            No income found. Add your first income.
          </p>
        ) : (
          income.map((item) => (
            <div
              className="income-card"
              key={item._id}
            >

              <div>
                <h3>{item.source}</h3>

                <p>
                  {item.description ||
                    "No description"}
                </p>

                <small>
                  {new Date(
                    item.date
                  ).toLocaleDateString()}
                </small>

                <small>
                  {" "}
                  • {item.paymentMethod}
                </small>
              </div>


              <div>
                <h3>
                  ₹
                  {Number(
                    item.amount
                  ).toLocaleString("en-IN")}
                </h3>

                <button
                  onClick={() =>
                    handleEdit(item)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(item._id)
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

export default Income;