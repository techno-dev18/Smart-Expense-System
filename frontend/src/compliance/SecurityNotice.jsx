const SecurityNotice = () => {
  return (
    <section
      className="security-notice"
      aria-labelledby="security-notice-title"
    >
      <h2 id="security-notice-title">Security</h2>

      <p>
        SmartExpense is designed with security controls appropriate to the
        application's architecture, including authenticated API access,
        protected routes, controlled database access, and secure handling of
        authentication credentials.
      </p>

      <p>
        Sensitive information should never be exposed in URLs, client-side
        source code, public repositories, logs, or error messages.
      </p>

      <p>
        Payment information should be processed through an appropriate payment
        provider rather than stored directly by SmartExpense unless the
        application has the required infrastructure and compliance controls.
      </p>

      <p>
        No website can guarantee absolute security. Security controls should
        be reviewed and updated as the application evolves.
      </p>
    </section>
  );
};

export default SecurityNotice;