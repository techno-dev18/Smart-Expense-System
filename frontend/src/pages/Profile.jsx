import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import "../styles/global.css";

function Profile() {
  const { user } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* Profile Header */}

        <div className="profile-header">

          <div className="profile-avatar">
            {user.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

          <div>
            <h1>
              {user.name || "User"}
            </h1>

            <p>
              {user.email}
            </p>
          </div>

        </div>


        {/* Account Information */}

        <div className="profile-section">

          <div className="profile-section-header">

            <div>
              <h2>
                Account Information
              </h2>

              <p>
                Your SmartExpense account
                details.
              </p>
            </div>

          </div>


          <div className="profile-info-grid">

            <div className="profile-info-card">

              <span>
                Full Name
              </span>

              <strong>
                {user.name || "Not available"}
              </strong>

            </div>


            <div className="profile-info-card">

              <span>
                Email Address
              </span>

              <strong>
                {user.email || "Not available"}
              </strong>

            </div>


            <div className="profile-info-card">

              <span>
                Account Status
              </span>

              <strong className="profile-status">
                Active
              </strong>

            </div>


            <div className="profile-info-card">

              <span>
                Account Type
              </span>

              <strong>
                Personal
              </strong>

            </div>

          </div>

        </div>


        {/* Security */}

        <div className="profile-section">

          <div className="profile-section-header">

            <div>
              <h2>
                Security
              </h2>

              <p>
                Manage your account security.
              </p>
            </div>

          </div>


          <div className="security-card">

            <div>
              <h3>
                Password
              </h3>

              <p>
                Your password is securely
                protected.
              </p>
            </div>


            <button
              type="button"
              className="profile-button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "Hide"
                : "Protected"}
            </button>

          </div>


          {showPassword && (
            <div className="security-message">
              Password information is never
              displayed for security reasons.
            </div>
          )}

        </div>


        {/* Account Summary */}

        <div className="profile-section">

          <div className="profile-section-header">

            <div>
              <h2>
                SmartExpense
              </h2>

              <p>
                Personal financial management
                dashboard.
              </p>
            </div>

          </div>


          <div className="profile-features">

            <div className="profile-feature">
              <span>✓</span>
              Expense Tracking
            </div>

            <div className="profile-feature">
              <span>✓</span>
              Income Management
            </div>

            <div className="profile-feature">
              <span>✓</span>
              Budget Management
            </div>

            <div className="profile-feature">
              <span>✓</span>
              Financial Analytics
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;