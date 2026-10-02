import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLinkClick = () => {
    handleScrollTop();
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo"
            onClick={handleLinkClick}
            aria-label="SmartExpense home"
          >
            Smart<span>Expense</span>
          </Link>

          <p className="footer-description">
            A smarter way to track expenses, manage income,
            plan budgets, and understand your financial habits.
          </p>

          <Link
            to="/dashboard"
            className="footer-dashboard-btn"
            onClick={handleLinkClick}
          >
            Go to Dashboard
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        {/* Product */}
        <div className="footer-column">
          <h3>Product</h3>

          <Link to="/dashboard" onClick={handleLinkClick}>
            Dashboard
          </Link>

          <Link to="/expenses" onClick={handleLinkClick}>
            Expenses
          </Link>

          <Link to="/income" onClick={handleLinkClick}>
            Income
          </Link>

          <Link to="/budget" onClick={handleLinkClick}>
            Budget
          </Link>

          <Link to="/analytics" onClick={handleLinkClick}>
            Analytics
          </Link>
        </div>

       {/* Account */}
<div className="footer-column">
  <h3>Account</h3>

  <Link to="/profile" onClick={handleLinkClick}>
    Profile
  </Link>

  <Link to="/login" onClick={handleLinkClick}>
    Login
  </Link>

  <Link to="/signup" onClick={handleLinkClick}>
    Create Account
  </Link>

  <a
    href="#settings-menu-button"
    onClick={(event) => {
      event.preventDefault();

      const settingsButton =
        document.getElementById("settings-menu-button");

      if (settingsButton) {
        settingsButton.focus();
        settingsButton.click();
      }
    }}
  >
    Settings
  </a>
</div>

        {/* Company */}
        <div className="footer-column">
          <h3>Company</h3>

          <Link to="/about" onClick={handleLinkClick}>
            About
          </Link>

          <Link to="/contact" onClick={handleLinkClick}>
            Contact
          </Link>

          <Link to="/faq" onClick={handleLinkClick}>
            FAQs
          </Link>

          <Link to="/accessibility" onClick={handleLinkClick}>
            Accessibility
          </Link>
        </div>
      </div>

      {/* Legal Section */}
      <div className="footer-legal">
        <div className="footer-legal-inner">
          <h3>Legal & Privacy</h3>

          <div className="footer-legal-links">
            <Link to="/terms" onClick={handleLinkClick}>
              Terms & Conditions
            </Link>

            <Link to="/privacy-policy" onClick={handleLinkClick}>
              Privacy Policy
            </Link>

            <Link to="/cookies" onClick={handleLinkClick}>
              Cookie Policy
            </Link>

            <Link to="/security" onClick={handleLinkClick}>
              Security & Data
            </Link>

            <Link to="/refund-policy" onClick={handleLinkClick}>
              Refund Policy
            </Link>

            <Link to="/disclaimer" onClick={handleLinkClick}>
              Legal Disclaimer
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">

          <p>
            © {new Date().getFullYear()} SmartExpense.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/about" onClick={handleLinkClick}>
              About
            </Link>

            <span aria-hidden="true">•</span>

            <Link to="/contact" onClick={handleLinkClick}>
              Contact
            </Link>

            <span aria-hidden="true">•</span>

            <Link to="/faq" onClick={handleLinkClick}>
              FAQs
            </Link>

            <span aria-hidden="true">•</span>

            <button
              type="button"
              className="back-to-top"
              onClick={handleScrollTop}
              aria-label="Back to top"
            >
              Back to top
              <span aria-hidden="true"> ↑</span>
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;