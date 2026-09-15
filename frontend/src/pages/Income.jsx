import { useEffect, useState } from "react";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import IncomeCard from "../components/IncomeCard";

import {
  getIncome,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../services/incomeApi";

import "../styles/income.css";
import "../styles/forms.css";

const Income = () => {
  const initialForm = {
    source: "",
    amount: "",
    description: "",
    date: "",
    paymentMethod: "Cash",
  };

  const [formData, setFormData] =
    useState(initialForm);

  const [income, setIncome] =
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

  const loadIncome = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getIncome();

      setIncome(
        data.income || []
      );
    } catch (error) {
      console.error(
        "Income Error:",
        error
      );

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

    if (!formData.source) {
      return "Please select an income source.";
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
        source:
          formData.source,

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
        await updateIncome(
          editingId,
          data
        );

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
      console.error(
        "Save Income Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Something went wrong while saving the income."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(
      item._id
    );

    setFormData({
      source:
        item.source || "",

      amount:
        item.amount || "",

      description:
        item.description || "",

      date: item.date
        ? item.date.substring(
            0,
            10
          )
        : "",

      paymentMethod:
        item.paymentMethod ||
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
      console.error(
        "Delete Income Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete income."
      );
    }
  };

  if (loading) {
    return (
      <div className="income-page">
        <Loading
          message="Loading income..."
        />
      </div>
    );
  }

  if (
    error &&
    income.length === 0
  ) {
    return (
      <div className="income-page">
        <ErrorState
          title="Unable to load income"
          message={error}
          actionText="Try Again"
          onAction={loadIncome}
        />
      </div>
    );
  }

  return (
    <div className="income-page">

      <div className="page-header">

        <div>
          <h1>
            Income
          </h1>

          <p>
            Track and manage your
            income sources.
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

      <div className="income-form-container">

        <h2>
          {editingId
            ? "Edit Income"
            : "Add Income"}
        </h2>

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          <div>

            <label htmlFor="source">
              Income Source
            </label>

            <select
              id="source"
              name="source"
              value={
                formData.source
              }
              onChange={
                handleChange
              }
              required
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
              placeholder="e.g. Monthly salary"
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

              <option value="Bank Transfer">
                Bank Transfer
              </option>

              <option value="Cheque">
                Cheque
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
                ? "Update Income"
                : "Add Income"}
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

      <div className="income-list">

        <h2>
          Your Income
        </h2>

        {income.length === 0 ? (

          <EmptyState
            title="No income yet"
            message="You haven't added any income. Start tracking your earnings to understand your financial position."
            actionText="Add Your First Income"
            onAction={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />

        ) : (

          <div className="income-items">

            {income.map(
              (item) => (
                <IncomeCard
                  key={
                    item._id
                  }
                  income={item}
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

export default Income;