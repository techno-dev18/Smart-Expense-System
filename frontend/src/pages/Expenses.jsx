import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ExpenseCard from "../components/ExpenseCard";
import ConfirmModal from "../components/ConfirmModal";

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

const createBulkExpense = () => ({
  id: `${Date.now()}-${Math.random()}`,
  ...createInitialForm(),
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

  // Multiple expense mode
  const [bulkMode, setBulkMode] = useState(false);

  const [bulkExpenses, setBulkExpenses] = useState([
    createBulkExpense(),
    createBulkExpense(),
  ]);

  /*
   * Load expenses
   */
  const loadExpenses = useCallback(
    async (showLoading = false) => {
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
    },
    []
  );

  /*
   * Initial data load
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

  /*
   * Single-entry form
   */
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

  /*
   * Add / update single expense
   */
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

  /*
   * Start editing
   */
  const handleEdit = (expense) => {
    setBulkMode(false);

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

  /*
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData(createInitialForm());

    setError("");
    setSuccess("");
  };

  /*
   * Open multiple-entry mode
   */
  const openBulkMode = () => {
    if (editingId) {
      setEditingId(null);
      setFormData(createInitialForm());
    }

    setBulkMode(true);

    setBulkExpenses([
      createBulkExpense(),
      createBulkExpense(),
    ]);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Close multiple-entry mode
   */
  const closeBulkMode = () => {
    if (submitting) {
      return;
    }

    setBulkMode(false);

    setBulkExpenses([
      createBulkExpense(),
      createBulkExpense(),
    ]);

    setError("");
    setSuccess("");
  };

  /*
   * Change one bulk row
   */
  const handleBulkChange = (
    rowId,
    field,
    value
  ) => {
    setBulkExpenses((previous) =>
      previous.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );

    setError("");
    setSuccess("");
  };

  /*
   * Add another bulk row
   */
  const addBulkRow = () => {
    if (bulkExpenses.length >= 20) {
      setError(
        "You can add a maximum of 20 expenses at once."
      );
      return;
    }

    setBulkExpenses((previous) => [
      ...previous,
      createBulkExpense(),
    ]);

    setError("");
  };

  /*
   * Remove one bulk row
   */
  const removeBulkRow = (rowId) => {
    if (bulkExpenses.length === 1) {
      setError(
        "At least one expense row is required."
      );
      return;
    }

    setBulkExpenses((previous) =>
      previous.filter(
        (row) => row.id !== rowId
      )
    );

    setError("");
    setSuccess("");
  };

  /*
   * Validate one bulk row
   */
  const validateBulkRow = (row, index) => {
    const amount = Number(row.amount);

    if (!row.category) {
      return `Expense ${index + 1}: Please select a category.`;
    }

    if (
      row.amount === "" ||
      row.amount === null
    ) {
      return `Expense ${index + 1}: Amount is required.`;
    }

    if (!Number.isFinite(amount)) {
      return `Expense ${index + 1}: Please enter a valid amount.`;
    }

    if (amount <= 0) {
      return `Expense ${index + 1}: Amount must be greater than 0.`;
    }

    if (amount > 100000000) {
      return `Expense ${index + 1}: Amount is too large.`;
    }

    if (row.description.length > 200) {
      return `Expense ${index + 1}: Description cannot exceed 200 characters.`;
    }

    if (!row.date) {
      return `Expense ${index + 1}: Date is required.`;
    }

    if (
      Number.isNaN(
        new Date(row.date).getTime()
      )
    ) {
      return `Expense ${index + 1}: Please enter a valid date.`;
    }

    return "";
  };

  /*
   * Save all bulk expenses
   */
  const handleBulkSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    for (
      let index = 0;
      index < bulkExpenses.length;
      index += 1
    ) {
      const validationError =
        validateBulkRow(
          bulkExpenses[index],
          index
        );

      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      setSubmitting(true);

      const expenseRequests =
        bulkExpenses.map((row) => {
          return addExpense({
            category: row.category,
            amount: Number(row.amount),
            description:
              row.description.trim(),
            date: row.date,
            paymentMethod:
              row.paymentMethod,
          });
        });

      await Promise.all(expenseRequests);

      const savedCount =
        bulkExpenses.length;

      setSuccess(
        `${savedCount} ${
          savedCount === 1
            ? "expense"
            : "expenses"
        } added successfully.`
      );

      setBulkExpenses([
        createBulkExpense(),
        createBulkExpense(),
      ]);

      await loadExpenses(false);
    } catch (error) {
      console.error(
        "Bulk Expense Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Some expenses could not be saved. Please check your entries and try again."
      );
    } finally {
      setSubmitting(false);
    }
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

      await deleteExpense(
        deleteTarget._id
      );

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
          onAction={() =>
            loadExpenses(true)
          }
        />
      </div>
    );
  }

  const renderCategoryOptions = () => (
    <>
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
    </>
  );

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

      {/* Mode Buttons */}
      {!editingId && (
        <div
          className="expense-entry-mode"
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setBulkMode(false);
              setError("");
              setSuccess("");
            }}
            disabled={submitting}
            aria-pressed={!bulkMode}
          >
            Add One Expense
          </button>

          <button
            type="button"
            onClick={openBulkMode}
            disabled={submitting}
            aria-pressed={bulkMode}
          >
            Add Multiple
          </button>
        </div>
      )}

      {/* ========================= */}
      {/* SINGLE EXPENSE FORM */}
      {/* ========================= */}

      {!bulkMode && (
        <div className="expense-form-container">

          <h2>
            {editingId
              ? "Edit Expense"
              : "Add Expense"}
          </h2>

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label={
              editingId
                ? "Edit expense form"
                : "Add expense form"
            }
          >

            {/* Category */}
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
                aria-required="true"
              >
                {renderCategoryOptions()}
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
                value={
                  formData.amount
                }
                onChange={
                  handleChange
                }
                required
                aria-required="true"
                inputMode="decimal"
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
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
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
                value={
                  formData.date
                }
                onChange={
                  handleChange
                }
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
      )}

      {/* ========================= */}
      {/* MULTIPLE EXPENSE FORM */}
      {/* ========================= */}

      {bulkMode && !editingId && (
        <div className="expense-form-container">

          <h2>
            Add Multiple Expenses
          </h2>

          <p>
            Add several expenses together and
            save them at once.
          </p>

          <form
            onSubmit={
              handleBulkSubmit
            }
            noValidate
            aria-label="Add multiple expenses form"
          >

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >

              {bulkExpenses.map(
                (row, index) => (
                  <div
                    key={row.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "16px",
                      background: "#fafafa",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        marginBottom: "14px",
                      }}
                    >
                      <strong>
                        Expense {index + 1}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          removeBulkRow(
                            row.id
                          )
                        }
                        disabled={
                          submitting
                        }
                        aria-label={`Remove expense ${index + 1}`}
                      >
                        Remove
                      </button>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "12px",
                      }}
                    >

                      {/* Category */}
                      <div>
                        <label
                          htmlFor={`bulk-category-${row.id}`}
                        >
                          Category
                        </label>

                        <select
                          id={`bulk-category-${row.id}`}
                          value={
                            row.category
                          }
                          onChange={(e) =>
                            handleBulkChange(
                              row.id,
                              "category",
                              e.target.value
                            )
                          }
                          required
                        >
                          {renderCategoryOptions()}
                        </select>
                      </div>

                      {/* Amount */}
                      <div>
                        <label
                          htmlFor={`bulk-amount-${row.id}`}
                        >
                          Amount
                        </label>

                        <input
                          id={`bulk-amount-${row.id}`}
                          type="number"
                          min="0.01"
                          max="100000000"
                          step="0.01"
                          placeholder="Enter amount"
                          value={
                            row.amount
                          }
                          onChange={(e) =>
                            handleBulkChange(
                              row.id,
                              "amount",
                              e.target.value
                            )
                          }
                          required
                          inputMode="decimal"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label
                          htmlFor={`bulk-description-${row.id}`}
                        >
                          Description
                        </label>

                        <input
                          id={`bulk-description-${row.id}`}
                          type="text"
                          maxLength="200"
                          placeholder="Description"
                          value={
                            row.description
                          }
                          onChange={(e) =>
                            handleBulkChange(
                              row.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {/* Date */}
                      <div>
                        <label
                          htmlFor={`bulk-date-${row.id}`}
                        >
                          Date
                        </label>

                        <input
                          id={`bulk-date-${row.id}`}
                          type="date"
                          value={
                            row.date
                          }
                          onChange={(e) =>
                            handleBulkChange(
                              row.id,
                              "date",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      {/* Payment */}
                      <div>
                        <label
                          htmlFor={`bulk-payment-${row.id}`}
                        >
                          Payment Method
                        </label>

                        <select
                          id={`bulk-payment-${row.id}`}
                          value={
                            row.paymentMethod
                          }
                          onChange={(e) =>
                            handleBulkChange(
                              row.id,
                              "paymentMethod",
                              e.target.value
                            )
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

                    </div>

                  </div>
                )
              )}

            </div>

            {/* Bulk Actions */}
            <div
              className="form-actions"
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >

              <button
                type="button"
                onClick={addBulkRow}
                disabled={
                  submitting ||
                  bulkExpenses.length >= 20
                }
              >
                + Add Row
              </button>

              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting
                  ? "Saving All..."
                  : `Save All ${bulkExpenses.length} ${
                      bulkExpenses.length === 1
                        ? "Expense"
                        : "Expenses"
                    }`}
              </button>

              <button
                type="button"
                onClick={
                  closeBulkMode
                }
                disabled={submitting}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Expense List */}
      <div className="expense-list">

        <h2>Your Expenses</h2>

        {expenses.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            message="You haven't added any expenses. Start tracking your spending to understand where your money goes."
            actionText="Add Your First Expense"
            onAction={() => {
              setBulkMode(false);

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
                  key={expense._id}
                  expense={expense}
                  onEdit={handleEdit}
                  onDelete={() =>
                    requestDelete(expense)
                  }
                />
              )
            )}

          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={
          Boolean(deleteTarget)
        }
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