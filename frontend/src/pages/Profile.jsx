import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/global.css";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const displayName = user.name || "User";
  const displayEmail = user.email || "Not available";

  return (
    <main
      className="profile-page"
      aria-labelledby="profile-page-title"
    >
      <div className="profile-container">

        {/* Profile Header */}

        <header className="profile-header">
          <div
            className="profile-avatar"
            aria-hidden="true"
          >
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="profile-eyebrow">
              My account
            </p>

            <h1 id="profile-page-title">
              {displayName}
            </h1>

            <p>
              {displayEmail}
            </p>
          </div>
        </header>

        {/* Account Information */}

        <section
          className="profile-section"
          aria-labelledby="account-information-title"
        >
          <div className="profile-section-header">
            <div>
              <h2 id="account-information-title">
                Account Information
              </h2>

              <p>
                Your SmartExpense account details.
              </p>
            </div>
          </div>

          <div className="profile-info-grid">

            <div className="profile-info-card">
              <span>Full Name</span>

              <strong>
                {displayName}
              </strong>
            </div>

            <div className="profile-info-card">
              <span>Email Address</span>

              <strong>
                {displayEmail}
              </strong>
            </div>

            <div className="profile-info-card">
              <span>Account Status</span>

              <strong className="profile-status">
                Active
              </strong>
            </div>

            <div className="profile-info-card">
              <span>Account Type</span>

              <strong>
                Personal
              </strong>
            </div>

          </div>
        </section>

        {/* Security */}

        <section
          className="profile-section"
          aria-labelledby="profile-security-title"
        >
          <div className="profile-section-header">
            <div>
              <h2 id="profile-security-title">
                Security
              </h2>

              <p>
                Information about the protection of
                your account.
              </p>
            </div>
          </div>

          <div className="security-card">

            <div>
              <h3>
                Password
              </h3>

              <p>
                Your password is protected and is
                never displayed in your profile.
              </p>
            </div>

            <Link
              to="/security"
              className="profile-button"
            >
              Security & Data
            </Link>

          </div>
        </section>

        {/* SmartExpense Features */}

        <section
          className="profile-section"
          aria-labelledby="profile-features-title"
        >
          <div className="profile-section-header">
            <div>
              <h2 id="profile-features-title">
                SmartExpense
              </h2>

              <p>
                Tools available in your personal
                finance dashboard.
              </p>
            </div>
          </div>

          <div className="profile-features">

            <div className="profile-feature">
              <span aria-hidden="true">✓</span>
              <span>Expense Tracking</span>
            </div>

            <div className="profile-feature">
              <span aria-hidden="true">✓</span>
              <span>Income Management</span>
            </div>

            <div className="profile-feature">
              <span aria-hidden="true">✓</span>
              <span>Budget Management</span>
            </div>

            <div className="profile-feature">
              <span aria-hidden="true">✓</span>
              <span>Financial Analytics</span>
            </div>

            <div className="profile-feature">
              <span aria-hidden="true">✓</span>
              <span>Transaction History</span>
            </div>

          </div>
        </section>

        {/* Quick Links */}

        <section
          className="profile-section"
          aria-labelledby="profile-links-title"
        >
          <div className="profile-section-header">
            <div>
              <h2 id="profile-links-title">
                Quick Links
              </h2>

              <p>
                Quickly access important account
                information.
              </p>
            </div>
          </div>

          <div className="profile-quick-links">

            <Link
              to="/security"
              className="profile-quick-link"
            >
              <span aria-hidden="true">
                🔒
              </span>

              <span>
                <strong>
                  Security & Data
                </strong>

                <small>
                  Learn how your account data is
                  protected.
                </small>
              </span>
            </Link>

            <Link
              to="/privacy-policy"
              className="profile-quick-link"
            >
              <span aria-hidden="true">
                🛡️
              </span>

              <span>
                <strong>
                  Privacy Policy
                </strong>

                <small>
                  Review how personal information is
                  handled.
                </small>
              </span>
            </Link>

            <Link
              to="/accessibility"
              className="profile-quick-link"
            >
              <span aria-hidden="true">
                ♿
              </span>

              <span>
                <strong>
                  Accessibility
                </strong>

                <small>
                  View SmartExpense accessibility
                  information.
                </small>
              </span>
            </Link>

            <Link
              to="/faq"
              className="profile-quick-link"
            >
              <span aria-hidden="true">
                ❓
              </span>

              <span>
                <strong>
                  Help & FAQ
                </strong>

                <small>
                  Find answers to common questions.
                </small>
              </span>
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}

export default Profile;