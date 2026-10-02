

const formatCurrency = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "₹0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

const formatDate = (date) => {
  if (!date) {
    return "No date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTitle = (transaction) => {
  if (transaction.transactionType === "income") {
    return transaction.source || "Income";
  }

  return transaction.category || "Expense";
};

const TransactionCard = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const isIncome = transaction.transactionType === "income";

  return (
    <article
      className={`transaction-card ${
        isIncome ? "transaction-income" : "transaction-expense"
      }`}
    >
      <div className="transaction-card-main">
        <div className="transaction-card-icon" aria-hidden="true">
          {isIncome ? "↗" : "↘"}
        </div>

        <div className="transaction-card-info">
          <h3>{getTitle(transaction)}</h3>

          {transaction.description && (
            <p className="transaction-description">
              {transaction.description}
            </p>
          )}

          <div className="transaction-meta">
            <span>{formatDate(transaction.date)}</span>

            {transaction.paymentMethod && (
              <>
                <span aria-hidden="true">•</span>
                <span>{transaction.paymentMethod}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="transaction-card-right">
        <p
          className={`transaction-amount ${
            isIncome ? "income-amount" : "expense-amount"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>

        <span
          className={`transaction-type ${
            isIncome ? "income-type" : "expense-type"
          }`}
        >
          {isIncome ? "Income" : "Expense"}
        </span>

        <div className="transaction-actions">
          <button
            type="button"
            className="transaction-edit-button"
            onClick={() => onEdit(transaction)}
            aria-label={`Edit ${getTitle(transaction)} transaction`}
          >
            Edit
          </button>

          <button
            type="button"
            className="transaction-delete-button"
            onClick={() => onDelete(transaction)}
            aria-label={`Delete ${getTitle(transaction)} transaction`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default TransactionCard;