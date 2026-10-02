import { useEffect, useRef } from "react";

const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}) => {
  const cancelButtonRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousActiveElement =
      document.activeElement;

    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      if (!loading) {
        cancelButtonRef.current?.focus();
      } else {
        modalRef.current?.focus();
      }
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (!loading) {
          onCancel();
        }

        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const modal = modalRef.current;

      if (!modal) {
        return;
      }

      const focusableElements =
        modal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

      const focusable = Array.from(
        focusableElements
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement =
        focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.clearTimeout(focusTimer);

      document.body.style.overflow = "";

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      if (
        previousActiveElement &&
        typeof previousActiveElement.focus === "function"
      ) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, loading, onCancel]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (
      event.target === event.currentTarget &&
      !loading
    ) {
      onCancel();
    }
  };

  return (
    <div
      className="confirm-modal-backdrop"
      onMouseDown={handleBackdropClick}
      aria-hidden={false}
    >
      <div
        ref={modalRef}
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        tabIndex="-1"
      >
        <div className="confirm-modal-content">

          <div className="confirm-modal-icon" aria-hidden="true">
            {danger ? "!" : "?"}
          </div>

          <div className="confirm-modal-text">
            <h2 id="confirm-modal-title">
              {title}
            </h2>

            <p id="confirm-modal-message">
              {message}
            </p>
          </div>

        </div>

        <div className="confirm-modal-actions">

          <button
            ref={cancelButtonRef}
            type="button"
            className="confirm-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            className={
              danger
                ? "confirm-modal-confirm confirm-modal-danger"
                : "confirm-modal-confirm"
            }
            onClick={onConfirm}
            disabled={loading}
            aria-busy={loading}
          >
            {loading
              ? "Processing..."
              : confirmText}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;