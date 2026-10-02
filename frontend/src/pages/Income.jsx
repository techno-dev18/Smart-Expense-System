import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import IncomeCard from "../components/IncomeCard";
import ConfirmModal from "../components/ConfirmModal";

import {
  getIncome,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../services/incomeApi";

import "../styles/income.css";
import "../styles/forms.css";

const getToday = () => {
  return new Date().toLocaleDateString("en-CA");
};

const createInitialForm = () => ({
  source: "",
  amount: "",
  description: "",
  date: getToday(),
  paymentMethod: "Cash",
});

const createBulkIncome = () => ({
  id: `${Date.now()}-${Math.random()}`,
  ...createInitialForm(),
});

const Income = () => {
  const [formData, setFormData] =
    useState(createInitialForm);

  const [income, setIncome] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  // Multiple income mode
  const [bulkMode, setBulkMode] =
    useState(false);

  const [bulkIncome, setBulkIncome] =
    useState([
      createBulkIncome(),
      createBulkIncome(),
    ]);

  /*
   * Load income records.
   */
  const loadIncome = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

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
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    []
  );

  /*
   * Initial page load.
   */
  useEffect(() => {
    let cancelled = false;

    const loadInitialIncome =
      async () => {
        try {
          const data =
            await getIncome();

          if (!cancelled) {
            setIncome(
              data.income || []
            );
          }
        } catch (error) {
          console.error(
            "Income Error:",
            error
          );

          if (!cancelled) {
            setError(
              error.response?.data
                ?.message ||
                "Failed to load income."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadInitialIncome();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Single-entry form
   */
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

    if (!formData.date) {
      return "Date is required.";
    }

    if (
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

  /*
   * Add / update single income
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );
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

      setFormData(
        createInitialForm()
      );

      setEditingId(null);

      await loadIncome(false);
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

  /*
   * Start editing
   */
  const handleEdit = (item) => {
    setBulkMode(false);

    setEditingId(
      item._id
    );

    setFormData({
      source:
        item.source || "",

      amount:
        item.amount ?? "",

      description:
        item.description || "",

      date: item.date
        ? item.date.substring(
            0,
            10
          )
        : getToday(),

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

  /*
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData(
      createInitialForm()
    );

    setError("");
    setSuccess("");
  };

  /*
   * Open multiple income mode
   */
  const openBulkMode = () => {
    if (editingId) {
      setEditingId(null);
      setFormData(
        createInitialForm()
      );
    }

    setBulkMode(true);

    setBulkIncome([
      createBulkIncome(),
      createBulkIncome(),
    ]);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Close multiple income mode
   */
  const closeBulkMode = () => {
    if (submitting) {
      return;
    }

    setBulkMode(false);

    setBulkIncome([
      createBulkIncome(),
      createBulkIncome(),
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
    setBulkIncome(
      (previous) =>
        previous.map(
          (row) =>
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
   * Add another income row
   */
  const addBulkRow = () => {
    if (bulkIncome.length >= 20) {
      setError(
        "You can add a maximum of 20 income entries at once."
      );
      return;
    }

    setBulkIncome(
      (previous) => [
        ...previous,
        createBulkIncome(),
      ]
    );

    setError("");
  };

  /*
   * Remove one income row
   */
  const removeBulkRow = (
    rowId
  ) => {
    if (bulkIncome.length === 1) {
      setError(
        "At least one income row is required."
      );
      return;
    }

    setBulkIncome(
      (previous) =>
        previous.filter(
          (row) =>
            row.id !== rowId
        )
    );

    setError("");
    setSuccess("");
  };

  /*
   * Validate one bulk income row
   */
  const validateBulkRow = (
    row,
    index
  ) => {
    const amount =
      Number(row.amount);

    if (!row.source) {
      return `Income ${index + 1}: Please select an income source.`;
    }

    if (
      row.amount === "" ||
      row.amount === null
    ) {
      return `Income ${index + 1}: Amount is required.`;
    }

    if (!Number.isFinite(amount)) {
      return `Income ${index + 1}: Please enter a valid amount.`;
    }

    if (amount <= 0) {
      return `Income ${index + 1}: Amount must be greater than 0.`;
    }

    if (amount > 100000000) {
      return `Income ${index + 1}: Amount is too large.`;
    }

    if (
      row.description.length > 200
    ) {
      return `Income ${index + 1}: Description cannot exceed 200 characters.`;
    }

    if (!row.date) {
      return `Income ${index + 1}: Date is required.`;
    }

    if (
      Number.isNaN(
        new Date(
          row.date
        ).getTime()
      )
    ) {
      return `Income ${index + 1}: Please enter a valid date.`;
    }

    return "";
  };

  /*
   * Save all income entries
   */
  const handleBulkSubmit =
    async (e) => {
      e.preventDefault();

      setError("");
      setSuccess("");

      for (
        let index = 0;
        index < bulkIncome.length;
        index += 1
      ) {
        const validationError =
          validateBulkRow(
            bulkIncome[index],
            index
          );

        if (validationError) {
          setError(
            validationError
          );
          return;
        }
      }

      try {
        setSubmitting(true);

        const incomeRequests =
          bulkIncome.map(
            (row) => {
              return addIncome({
                source:
                  row.source,

                amount:
                  Number(
                    row.amount
                  ),

                description:
                  row.description.trim(),

                date:
                  row.date,

                paymentMethod:
                  row.paymentMethod,
              });
            }
          );

        await Promise.all(
          incomeRequests
        );

        const savedCount =
          bulkIncome.length;

        setSuccess(
          `${savedCount} ${
            savedCount === 1
              ? "income entry"
              : "income entries"
          } added successfully.`
        );

        setBulkIncome([
          createBulkIncome(),
          createBulkIncome(),
        ]);

        await loadIncome(false);
      } catch (error) {
        console.error(
          "Bulk Income Error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Some income entries could not be saved. Please check your entries and try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

  /*
   * Open delete confirmation modal.
   */
  const requestDelete = (
    item
  ) => {
    setDeleteTarget(item);

    setError("");
    setSuccess("");
  };

  /*
   * Delete income
   */
  const handleDelete =
    async () => {
      if (
        !deleteTarget?._id
      ) {
        return;
      }

      try {
        setDeleting(true);

        setError("");
        setSuccess("");

        await deleteIncome(
          deleteTarget._id
        );

        setSuccess(
          "Income deleted successfully."
        );

        setDeleteTarget(null);

        await loadIncome(
          false
        );
      } catch (error) {
        console.error(
          "Delete Income Error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Failed to delete income."
        );
      } finally {
        setDeleting(false);
      }
    };

  const handleRetry = () => {
    loadIncome(true);
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
          onAction={handleRetry}
        />
      </div>
    );
  }

  const renderSourceOptions =
    () => (
      <>
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
      </>
    );

  return (
    <div className="income-page">

      {/* Page Header */}
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

      {/* Status messages */}
      {error && (
        <div
          className="error-message"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

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
          className="income-entry-mode"
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
            Add One Income
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
      {/* SINGLE INCOME FORM */}
      {/* ========================= */}

      {!bulkMode && (
        <div className="income-form-container">

          <h2>
            {editingId
              ? "Edit Income"
              : "Add Income"}
          </h2>

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label={
              editingId
                ? "Edit income form"
                : "Add income form"
            }
          >

            {/* Income Source */}
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
                aria-required="true"
              >
                {renderSourceOptions()}
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

            {/* Date */}
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

            {/* Form Actions */}
            <div className="form-actions">

              <button
                type="submit"
                disabled={submitting}
                aria-busy={
                  submitting
                }
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
                  disabled={
                    submitting
                  }
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </div>
      )}

      {/* ========================= */}
      {/* MULTIPLE INCOME FORM */}
      {/* ========================= */}

      {bulkMode && !editingId && (
        <div className="income-form-container">

          <h2>
            Add Multiple Income
          </h2>

          <p>
            Add several income entries
            together and save them at once.
          </p>

          <form
            onSubmit={
              handleBulkSubmit
            }
            noValidate
            aria-label="Add multiple income form"
          >

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "16px",
              }}
            >

              {bulkIncome.map(
                (row, index) => (
                  <div
                    key={row.id}
                    style={{
                      border:
                        "1px solid #e5e7eb",
                      borderRadius:
                        "12px",
                      padding:
                        "16px",
                      background:
                        "#fafafa",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        marginBottom:
                          "14px",
                      }}
                    >
                      <strong>
                        Income {index + 1}
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
                        aria-label={`Remove income ${index + 1}`}
                      >
                        Remove
                      </button>
                    </div>

                    <div
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "12px",
                      }}
                    >

                      {/* Source */}
                      <div>
                        <label
                          htmlFor={`bulk-source-${row.id}`}
                        >
                          Income Source
                        </label>

                        <select
                          id={`bulk-source-${row.id}`}
                          value={
                            row.source
                          }
                          onChange={(e) =>
                            handleBulkChange(
                              row.id,
                              "source",
                              e.target.value
                            )
                          }
                          required
                        >
                          {renderSourceOptions()}
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

                    </div>

                  </div>
                )
              )}

            </div>

            {/* Bulk Actions */}
            <div
              className="form-actions"
              style={{
                marginTop:
                  "20px",
                display:
                  "flex",
                gap: "10px",
                flexWrap:
                  "wrap",
              }}
            >

              <button
                type="button"
                onClick={
                  addBulkRow
                }
                disabled={
                  submitting ||
                  bulkIncome.length >=
                    20
                }
              >
                + Add Row
              </button>

              <button
                type="submit"
                disabled={
                  submitting
                }
                aria-busy={
                  submitting
                }
              >
                {submitting
                  ? "Saving All..."
                  : `Save All ${bulkIncome.length} ${
                      bulkIncome.length === 1
                        ? "Income"
                        : "Income Entries"
                    }`}
              </button>

              <button
                type="button"
                onClick={
                  closeBulkMode
                }
                disabled={
                  submitting
                }
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Income List */}
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
              setBulkMode(false);

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
                  onDelete={() =>
                    requestDelete(
                      item
                    )
                  }
                />
              )
            )}

          </div>

        )}

      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={
          Boolean(deleteTarget)
        }
        title="Delete Income"
        message={
          deleteTarget
            ? `Are you sure you want to delete this ${deleteTarget.source || "income"} entry? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Income"
        cancelText="Cancel"
        onConfirm={
          handleDelete
        }
        onCancel={() => {
          if (!deleting) {
            setDeleteTarget(null);
          }
        }}
        loading={deleting}
        danger
      />

    </div>
  );
};

export default Income;