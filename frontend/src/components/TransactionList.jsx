
import TransactionCard from "./TransactionCard";

const TransactionList = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="transaction-empty-state" role="status">
        <div
          className="transaction-empty-icon"
          aria-hidden="true"
        >
          ₹
        </div>

        <h3>No transactions found</h3>

        <p>
          There are no transactions matching your current
          filters.
        </p>
      </div>
    );
  }

  return (
    <section
      className="transaction-list"
      aria-label="Transaction history"
    >
      <div className="transaction-list-header">
        <h2>Transaction History</h2>

        <span className="transaction-count">
          {transactions.length}{" "}
          {transactions.length === 1
            ? "transaction"
            : "transactions"}
        </span>
      </div>

      <div className="transaction-list-items">
        {transactions.map((transaction) => (
          <TransactionCard
            key={`${transaction.transactionType}-${transaction._id}`}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default TransactionList;