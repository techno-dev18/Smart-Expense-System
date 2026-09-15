function IncomeCard({
  income,
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
    <div className="income-card">

      <div className="income-card-header">

        <div>
          <h3>
            {income.source}
          </h3>

          <span className="income-date">
            {formatDate(income.date)}
          </span>
        </div>

        <strong className="income-amount">
          {formatCurrency(
            income.amount
          )}
        </strong>

      </div>

      <div className="income-card-details">

        {income.description && (
          <p>
            <span>Description</span>
            {income.description}
          </p>
        )}

        <p>
          <span>Payment Method</span>

          {income.paymentMethod ||
            "Not specified"}
        </p>

      </div>

      <div className="income-card-actions">

        <button
          type="button"
          className="income-edit-button"
          onClick={() =>
            onEdit(income)
          }
        >
          Edit
        </button>

        <button
          type="button"
          className="income-delete-button"
          onClick={() =>
            onDelete(income._id)
          }
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default IncomeCard;