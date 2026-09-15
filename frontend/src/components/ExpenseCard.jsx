function ExpenseCard({
  expense,
  onEdit,
  onDelete,
}) {
  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="expense-card">

      <div className="expense-card-header">

        <div>
          <h3>
            {expense.category}
          </h3>

          <span className="expense-date">
            {formatDate(expense.date)}
          </span>
        </div>

        <strong className="expense-amount">
          {formatCurrency(expense.amount)}
        </strong>

      </div>


      <div className="expense-card-details">

        {expense.description && (
          <p>
            <span>Description</span>
            {expense.description}
          </p>
        )}

        <p>
          <span>Payment Method</span>
          {expense.paymentMethod ||
            "Not specified"}
        </p>

      </div>


      <div className="expense-card-actions">

        <button
          type="button"
          className="expense-edit-button"
          onClick={() => onEdit(expense)}
        >
          Edit
        </button>

        <button
          type="button"
          className="expense-delete-button"
          onClick={() =>
            onDelete(expense._id)
          }
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default ExpenseCard;