import LegalDisclaimer from "../compliance/LegalDisclaimer";

const LegalDisclaimerPage = () => {
  return (
    <main id="main-content" className="legal-page">
      <div className="legal-container">
        <p className="legal-label">Legal</p>

        <h1>Legal Disclaimer</h1>

        <LegalDisclaimer />

        <section>
          <h2>Accuracy of user-entered information</h2>

          <p>
            Calculations and reports depend on information entered into the
            application. Incorrect, incomplete, duplicated, or outdated data
            may result in inaccurate results.
          </p>
        </section>

        <section>
          <h2>Predictions and projections</h2>

          <p>
            Any projected spending, budget estimates, recommendations, or
            analytics are calculations based on available application data and
            should not be interpreted as guaranteed future outcomes.
          </p>
        </section>

        <section>
          <h2>Third-party information</h2>

          <p>
            Third-party services and information may be subject to their own
            terms, availability, accuracy, and privacy policies.
          </p>
        </section>
      </div>
    </main>
  );
};

export default LegalDisclaimerPage;