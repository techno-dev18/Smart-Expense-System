
import "../styles/global.css";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information. Please try again.",
  actionText = "Try Again",
  onAction,
}) {
  return (
    <div className="error-state">

      <div className="error-state-icon">
        !
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {onAction && (
        <button
          type="button"
          className="error-state-button"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}

    </div>
  );
}

export default ErrorState;
