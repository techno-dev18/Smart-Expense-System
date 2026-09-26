const AccessibilityStatement = () => {
  return (
    <main id="main-content" className="legal-page">
      <div className="legal-container">
        <p className="legal-label">Accessibility</p>

        <h1>Accessibility Statement</h1>

        <p className="legal-date">
          Effective date: [INSERT DATE]
        </p>

        <section>
          <h2>Our commitment</h2>

          <p>
            SmartExpense aims to make its application usable by people with
            different abilities and assistive technologies.
          </p>
        </section>

        <section>
          <h2>Accessibility practices</h2>

          <ul>
            <li>Semantic HTML where appropriate.</li>
            <li>Keyboard-accessible controls.</li>
            <li>Visible keyboard focus indicators.</li>
            <li>Descriptive button labels.</li>
            <li>Accessible form labels.</li>
            <li>Meaningful error messages.</li>
            <li>Accessible expandable content.</li>
            <li>Appropriate ARIA attributes where required.</li>
            <li>Responsive layouts.</li>
            <li>Alternative text for meaningful images.</li>
          </ul>
        </section>

        <section>
          <h2>Accessibility feedback</h2>

          <p>
            If you encounter an accessibility barrier, contact:
          </p>

          <p>
            <strong>[ACCESSIBILITY CONTACT EMAIL]</strong>
          </p>

          <p>
            Please describe the page, feature, and problem so it can be
            investigated.
          </p>
        </section>

        <section>
          <h2>Standards</h2>

          <p>
            The application is intended to follow applicable accessibility
            principles and recognized web accessibility practices. Formal
            conformance should be verified through accessibility testing
            before making a specific conformance claim.
          </p>
        </section>
      </div>
    </main>
  );
};

export default AccessibilityStatement;