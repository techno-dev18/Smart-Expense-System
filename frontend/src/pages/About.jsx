import "../styles/about.css";

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">
            ABOUT SMARTEXPENSE
          </span>

          <h1>
            Take control of your
            <span> finances.</span>
          </h1>

          <p>
            SmartExpense is a personal finance
            management platform designed to make
            tracking income, expenses, budgets,
            and financial insights simple.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-eyebrow">
            OUR PURPOSE
          </span>

          <h2>
            Better financial awareness,
            every day.
          </h2>

          <p>
            Managing money becomes easier when
            your financial information is
            organized in one place. SmartExpense
            brings your income, expenses, budgets,
            and analytics together in a simple
            interface.
          </p>
        </div>

        <div className="about-feature-grid">
          <div className="about-feature-card">
            <div className="about-feature-number">
              01
            </div>

            <h3>Track</h3>

            <p>
              Record your income and expenses and
              keep your financial activity
              organized.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-number">
              02
            </div>

            <h3>Plan</h3>

            <p>
              Set monthly budgets and monitor your
              spending against your financial
              limits.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-number">
              03
            </div>

            <h3>Understand</h3>

            <p>
              Analyze spending patterns and
              understand where your money is going.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-number">
              04
            </div>

            <h3>Improve</h3>

            <p>
              Use financial insights and budget
              recommendations to make better
              decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="about-technology">
        <div className="about-technology-content">
          <span className="about-eyebrow">
            TECHNOLOGY
          </span>

          <h2>
            Built as a modern full-stack
            application.
          </h2>

          <p>
            SmartExpense combines a responsive
            React interface with a Node.js and
            Express backend, MongoDB persistence,
            JWT authentication, and a C++ analytics
            engine for financial calculations.
          </p>

          <div className="about-tech-list">
            <span>React</span>
            <span>Node.js</span>
            <span>Express</span>
            <span>MongoDB</span>
            <span>JWT</span>
            <span>C++</span>
          </div>
        </div>
      </section>

      <section className="about-final">
        <h2>
          Your money.
          <br />
          Your decisions.
        </h2>

        <p>
          SmartExpense gives you the tools to
          understand your finances and stay
          informed about your financial habits.
        </p>
      </section>
    </div>
  );
}

export default About;