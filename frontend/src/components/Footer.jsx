import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo"
            onClick={handleScrollTop}
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
            onClick={handleScrollTop}
          >
            Go to Dashboard →
          </Link>
        </div>

        {/* Product Links */}
        <div className="footer-column">
          <h3>Product</h3>

          <Link to="/dashboard" onClick={handleScrollTop}>
            Dashboard
          </Link>

          <Link to="/expenses" onClick={handleScrollTop}>
            Expenses
          </Link>

          <Link to="/income" onClick={handleScrollTop}>
            Income
          </Link>

          <Link to="/budget" onClick={handleScrollTop}>
            Budget
          </Link>

          <Link to="/analytics" onClick={handleScrollTop}>
            Analytics
          </Link>
        </div>

        {/* Account Links */}
        <div className="footer-column">
          <h3>Account</h3>

          <Link to="/profile" onClick={handleScrollTop}>
            Profile
          </Link>

          <Link to="/login" onClick={handleScrollTop}>
            Login
          </Link>

          <Link to="/signup" onClick={handleScrollTop}>
            Create Account
          </Link>
        </div>

        {/* Company Links */}
        <div className="footer-column">
          <h3>Company</h3>

          <Link to="/about" onClick={handleScrollTop}>
            About
          </Link>

          <Link to="/contact" onClick={handleScrollTop}>
            Contact
          </Link>

          <Link to="/" onClick={handleScrollTop}>
            Home
          </Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">

          <p>
            © {new Date().getFullYear()} SmartExpense. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/about" onClick={handleScrollTop}>
              About
            </Link>

            <span>•</span>

            <Link to="/contact" onClick={handleScrollTop}>
              Contact
            </Link>

            <span>•</span>

            <button
              className="back-to-top"
              onClick={handleScrollTop}
            >
              Back to top ↑
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;