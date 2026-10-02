import  { useCallback, useEffect, useMemo, useState } from "react";

import {
  getTransactions,
  deleteExpenseTransaction,
  deleteIncomeTransaction,
} from "../services/transactionApi";

import TransactionFilters from "../components/TransactionFilters";
import TransactionList from "../components/TransactionList";
import ConfirmModal from "../components/ConfirmModal";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const loadTransactions = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getTransactions();

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load transactions. Please try again."
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchInitialTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getTransactions();

        if (!cancelled) {
          setTransactions(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load transactions:", err);

        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Unable to load transactions. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitialTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = transactions.filter((transaction) => {
      const transactionTitle =
        transaction.transactionType === "income"
          ? transaction.source || ""
          : transaction.category || "";

      const description = transaction.description || "";
      const method = transaction.paymentMethod || "";

      const searchableText = `${transactionTitle} ${description} ${method}`
        .toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        searchableText.includes(normalizedSearch);

      const matchesType =
        type === "all" ||
        transaction.transactionType === type;

      const matchesPaymentMethod =
        paymentMethod === "all" ||
        transaction.paymentMethod === paymentMethod;

      return (
        matchesSearch &&
        matchesType &&
        matchesPaymentMethod
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "highest") {
        return Number(b.amount) - Number(a.amount);
      }

      if (sortOrder === "lowest") {
        return Number(a.amount) - Number(b.amount);
      }

      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (sortOrder === "oldest") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });
  }, [
    transactions,
    search,
    type,
    paymentMethod,
    sortOrder,
  ]);

  const clearFilters = () => {
    setSearch("");
    setType("all");
    setPaymentMethod("all");
    setSortOrder("newest");
  };

  const handleEdit = (transaction) => {
    /*
     * Transactions combines two different resources:
     * expenses and income.
     *
     * The existing Expense and Income pages already contain
     * their complete editing forms.
     *
     * For now, take the user to the correct page where the
     * existing edit functionality can be used safely.
     */
    if (transaction.transactionType === "income") {
      window.location.href = "/income";
      return;
    }

    window.location.href = "/expenses";
  };

  const requestDelete = (transaction) => {
    setError("");
    setSuccess("");
    setDeleteTarget(transaction);
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      if (deleteTarget.transactionType === "income") {
        await deleteIncomeTransaction(deleteTarget._id);
      } else {
        await deleteExpenseTransaction(deleteTarget._id);
      }

      setDeleteTarget(null);

      setSuccess(
        `${
          deleteTarget.transactionType === "income"
            ? "Income"
            : "Expense"
        } transaction deleted successfully.`
      );

      await loadTransactions(false);
    } catch (err) {
      console.error("Failed to delete transaction:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete the transaction. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(
        (transaction) =>
          transaction.transactionType === "income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [filteredTransactions]);

  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter(
        (transaction) =>
          transaction.transactionType === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [filteredTransactions]);

  const netAmount = totalIncome - totalExpenses;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  if (loading) {
    return (
      <main
        className="transactions-page"
        aria-labelledby="transactions-page-title"
      >
        <div className="transactions-container">
          <div
            className="transactions-loading"
            role="status"
            aria-live="polite"
          >
            <div
              className="loading-spinner"
              aria-hidden="true"
            />

            <p>Loading transactions...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="transactions-page"
      aria-labelledby="transactions-page-title"
    >
      <div className="transactions-container">
        <header className="transactions-header">
          <div>
            <p className="transactions-eyebrow">
              Financial activity
            </p>

            <h1 id="transactions-page-title">
              Transactions
            </h1>

            <p className="transactions-subtitle">
              View and manage your income and expenses in one
              place.
            </p>
          </div>

          <button
            type="button"
            className="transactions-refresh-button"
            onClick={() => loadTransactions(true)}
            disabled={loading}
          >
            Refresh
          </button>
        </header>

        {error && (
          <div
            className="transactions-message transactions-error"
            role="alert"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div
            className="transactions-message transactions-success"
            role="status"
            aria-live="polite"
          >
            <span>{success}</span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        <section
          className="transaction-summary"
          aria-label="Transaction summary"
        >
          <div className="transaction-summary-card">
            <span>Total income</span>

            <strong className="summary-income">
              {formatCurrency(totalIncome)}
            </strong>
          </div>

          <div className="transaction-summary-card">
            <span>Total expenses</span>

            <strong className="summary-expense">
              {formatCurrency(totalExpenses)}
            </strong>
          </div>

          <div className="transaction-summary-card">
            <span>Net amount</span>

            <strong
              className={
                netAmount >= 0
                  ? "summary-positive"
                  : "summary-negative"
              }
            >
              {formatCurrency(netAmount)}
            </strong>
          </div>

          <div className="transaction-summary-card">
            <span>Transactions</span>

            <strong>
              {filteredTransactions.length}
            </strong>
          </div>
        </section>

        <TransactionFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onClear={clearFilters}
        />

        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={requestDelete}
        />

        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          title="Delete Transaction"
          message={
            deleteTarget
              ? `Are you sure you want to delete this ${
                  deleteTarget.transactionType === "income"
                    ? "income"
                    : "expense"
                } transaction? This action cannot be undone.`
              : ""
          }
          confirmText="Delete Transaction"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => {
            if (!deleting) {
              setDeleteTarget(null);
            }
          }}
          loading={deleting}
          danger
        />
      </div>
    </main>
  );
};

export default Transactions;