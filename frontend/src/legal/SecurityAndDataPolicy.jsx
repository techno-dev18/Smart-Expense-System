import SecurityNotice from "../compliance/SecurityNotice";

const SecurityAndDataPolicy = () => {
  return (
    <main id="main-content" className="legal-page">
      <div className="legal-container">
        <p className="legal-label">Security</p>

        <h1>Security and Data Protection</h1>

        <p className="legal-date">
          Effective date: [INSERT DATE]
        </p>

        <SecurityNotice />

        <section>
          <h2>Authentication</h2>

          <p>
            Access to protected functionality should require appropriate
            authentication and authorization.
          </p>
        </section>

        <section>
          <h2>Database protection</h2>

          <p>
            Database credentials and connection strings must never be exposed
            in frontend source code or committed to public repositories.
          </p>
        </section>

        <section>
          <h2>Secrets</h2>

          <p>
            API keys, JWT secrets, database credentials, payment credentials,
            and other secrets should be stored using appropriate server-side
            environment or secret-management facilities.
          </p>
        </section>

        <section>
          <h2>Incident handling</h2>

          <p>
            Suspected security incidents should be investigated and handled
            according to an appropriate incident-response procedure.
          </p>
        </section>

        <section>
          <h2>Responsible disclosure</h2>

          <p>
            Security vulnerabilities can be reported to:
          </p>

          <p>
            <strong>[SECURITY CONTACT EMAIL]</strong>
          </p>
        </section>
      </div>
    </main>
  );
};

export default SecurityAndDataPolicy;