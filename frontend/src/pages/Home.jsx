import { Link } from "react-router-dom";

import "../styles/global.css";

const Home = () => {
  return (
    <main className="home-page">

      {/* Hero */}

      <section className="home-hero">

        <div className="home-hero-content">

          <span className="home-badge">
            PERSONAL FINANCE MANAGEMENT
          </span>

          <h1>
            Take control of
            <span> your money.</span>
          </h1>

          <p>
            SmartExpense helps you track income,
            manage expenses, set budgets and
            understand your financial habits
            from one simple dashboard.
          </p>

          <div className="home-hero-actions">

            <Link
              to="/signup"
              className="home-primary-button"
            >
              Start Managing Money
            </Link>

            <Link
              to="/login"
              className="home-secondary-button"
            >
              Sign In
            </Link>

          </div>

        </div>

        <div className="home-hero-card">

          <div className="hero-card-header">
            <span>Financial Overview</span>
            <span>•••</span>
          </div>

          <div className="hero-balance">
            <small>Total Balance</small>

            <strong>
              ₹48,750
            </strong>
          </div>

          <div className="hero-card-stats">

            <div>
              <span>Income</span>
              <strong>₹65,000</strong>
            </div>

            <div>
              <span>Expenses</span>
              <strong>₹16,250</strong>
            </div>

          </div>

          <div className="hero-progress">

            <div className="hero-progress-label">
              <span>Monthly Budget</span>
              <strong>65%</strong>
            </div>

            <div className="hero-progress-bar">
              <div
                className="hero-progress-fill"
                style={{
                  width: "65%",
                }}
              />
            </div>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="home-features">

        <div className="home-section-heading">

          <span>
            SMART FINANCE
          </span>

          <h2>
            Everything you need
            to manage your finances
          </h2>

          <p>
            Keep your financial information
            organized and make better decisions
            with meaningful insights.
          </p>

        </div>

        <div className="home-feature-grid">

          <div className="home-feature-card">

            <div className="home-feature-icon">
              ₹
            </div>

            <h3>
              Track Income
            </h3>

            <p>
              Record salary, freelance,
              business, investment and other
              income sources in one place.
            </p>

          </div>

          <div className="home-feature-card">

            <div className="home-feature-icon">
              ↓
            </div>

            <h3>
              Manage Expenses
            </h3>

            <p>
              Categorize your spending and
              understand exactly where your
              money is going.
            </p>

          </div>

          <div className="home-feature-card">

            <div className="home-feature-icon">
              %
            </div>

            <h3>
              Set Budgets
            </h3>

            <p>
              Create category-based budgets
              and monitor your spending before
              you exceed your limits.
            </p>

          </div>

          <div className="home-feature-card">

            <div className="home-feature-icon">
              ↗
            </div>

            <h3>
              Financial Analytics
            </h3>

            <p>
              Get meaningful financial
              insights powered by your
              transaction data.
            </p>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="home-cta">

        <div>

          <span>
            START TODAY
          </span>

          <h2>
            Build better financial habits.
          </h2>

          <p>
            Start tracking your money with
            SmartExpense.
          </p>

        </div>

        <Link
          to="/signup"
          className="home-primary-button"
        >
          Create Free Account
        </Link>

      </section>

    </main>
  );
};

export default Home;