

const TransactionFilters = ({
  search,
  setSearch,
  type,
  setType,
  paymentMethod,
  setPaymentMethod,
  sortOrder,
  setSortOrder,
  onClear,
}) => {
  return (
    <section
      className="transaction-filters"
      aria-label="Transaction filters"
    >
      <div className="transaction-filter-group transaction-search-group">
        <label htmlFor="transaction-search">
          Search transactions
        </label>

        <input
          id="transaction-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by category, source or description"
          autoComplete="off"
        />
      </div>

      <div className="transaction-filter-group">
        <label htmlFor="transaction-type">
          Type
        </label>

        <select
          id="transaction-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="all">All transactions</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>

      <div className="transaction-filter-group">
        <label htmlFor="transaction-payment">
          Payment method
        </label>

        <select
          id="transaction-payment"
          value={paymentMethod}
          onChange={(event) =>
            setPaymentMethod(event.target.value)
          }
        >
          <option value="all">All payment methods</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="transaction-filter-group">
        <label htmlFor="transaction-sort">
          Sort by
        </label>

        <select
          id="transaction-sort"
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value)
          }
        >
          <option value="newest">
            Newest first
          </option>

          <option value="oldest">
            Oldest first
          </option>

          <option value="highest">
            Highest amount
          </option>

          <option value="lowest">
            Lowest amount
          </option>
        </select>
      </div>

      <div className="transaction-filter-actions">
        <button
          type="button"
          className="transaction-clear-button"
          onClick={onClear}
        >
          Clear filters
        </button>
      </div>
    </section>
  );
};

export default TransactionFilters;