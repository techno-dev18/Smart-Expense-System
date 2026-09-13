import "../styles/global.css";

function EmptyState({
  title = "No data found",
  message = "There is nothing to display here yet.",
  actionText,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        +
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {actionText && onAction && (
        <button
          type="button"
          className="empty-state-button"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;