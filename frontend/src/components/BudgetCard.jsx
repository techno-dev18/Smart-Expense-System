function BudgetCard({
  budget,
  actual,
  usage,
  remaining,
  overspending,
  pace,
  projected,
  projectedOverspending,
  recommendation,
  status,
  paceStatus,
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

  return (
    <div
      className={`budget-card ${status.className}`}
    >
      {/* =====================================
          CARD HEADER
      ====================================== */}

      <div className="budget-card-header">

        <div>
          <h3>
            {budget.category}
          </h3>

          <span>
            {budget.month}/{budget.year}
          </span>
        </div>

        <span
          className={`budget-status ${status.className}`}
        >
          {status.label}
        </span>

      </div>

      {/* =====================================
          AMOUNTS
      ====================================== */}

      <div className="budget-amounts">

        <div>
          <span>
            Budget
          </span>

          <strong>
            {formatCurrency(
              budget.amount
            )}
          </strong>
        </div>

        <div>
          <span>
            Spent
          </span>

          <strong>
            {formatCurrency(actual)}
          </strong>
        </div>

        <div>
          <span>
            Remaining
          </span>

          <strong
            className={
              Number(remaining) < 0
                ? "negative"
                : ""
            }
          >
            {formatCurrency(
              remaining
            )}
          </strong>
        </div>

      </div>

      {/* =====================================
          PROGRESS
      ====================================== */}

      <div className="budget-progress">

        <div className="budget-progress-info">

          <span>
            Budget Usage
          </span>

          <strong>
            {Number(
              usage || 0
            ).toFixed(1)}
            %
          </strong>

        </div>

        <div className="budget-progress-track">

          <div
            className={`budget-progress-bar ${status.className}`}
            style={{
              width: `${Math.min(
                Math.max(
                  Number(usage || 0),
                  0
                ),
                100
              )}%`,
            }}
          />

        </div>

      </div>

      {/* =====================================
          BUDGET INTELLIGENCE
      ====================================== */}

      <div className="budget-intelligence">

        {/* Spending Pace */}

        <div className="intelligence-card">

          <div className="intelligence-title">

            <span>
              📊 Spending Pace
            </span>

            <span
              className={`pace-badge ${paceStatus.className}`}
            >
              {paceStatus.label}
            </span>

          </div>

          <strong>
            {Number(
              pace || 0
            ).toFixed(1)}
            %
          </strong>

          <p>
            Compared with the expected
            spending pace for this month.
          </p>

        </div>

        {/* Projected Spending */}

        <div className="intelligence-card">

          <div className="intelligence-title">

            <span>
              🔮 Projected Spending
            </span>

          </div>

          <strong>
            {formatCurrency(
              projected
            )}
          </strong>

          <p>
            Estimated spending by the
            end of the month.
          </p>

        </div>

        {/* Projected Risk */}

        <div className="intelligence-card">

          <div className="intelligence-title">

            <span>
              ⚠️ Projected Risk
            </span>

          </div>

          <strong
            className={
              Number(
                projectedOverspending || 0
              ) > 0
                ? "negative"
                : "positive"
            }
          >
            {Number(
              projectedOverspending || 0
            ) > 0
              ? `${formatCurrency(
                  projectedOverspending
                )} over`
              : "No overspending"}
          </strong>

          <p>
            {Number(
              projectedOverspending || 0
            ) > 0
              ? "Current spending pace may exceed your budget."
              : "Your current pace is projected to stay within budget."}
          </p>

        </div>

      </div>

      {/* =====================================
          SMART RECOMMENDATION
      ====================================== */}

      {recommendation && (
        <div className="budget-recommendation">

          <div className="recommendation-icon">
            💡
          </div>

          <div>

            <h4>
              Smart Recommendation
            </h4>

            <p>
              {recommendation}
            </p>

          </div>

        </div>
      )}

      {/* =====================================
          OVERSPENDING
      ====================================== */}

      {Number(overspending || 0) > 0 && (
        <div className="overspending-message">

          ⚠️ You have exceeded this
          budget by{" "}
          {formatCurrency(
            overspending
          )}
          .

        </div>
      )}

      {/* =====================================
          ACTIONS
      ====================================== */}

      <div className="budget-actions">

        <button
          type="button"
          onClick={() =>
            onEdit(budget)
          }
          className="edit-button"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(budget._id)
          }
          className="delete-button"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default BudgetCard;