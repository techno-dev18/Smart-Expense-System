const RefundPolicy = () => {
  return (
    <main id="main-content" className="legal-page">
      <div className="legal-container">
        <p className="legal-label">Billing</p>

        <h1>Refund and Cancellation Policy</h1>

        <p className="legal-date">
          Effective date: [INSERT DATE]
        </p>

        <section>
          <h2>1. Free services</h2>

          <p>
            Free SmartExpense features do not create a payment obligation.
          </p>
        </section>

        <section>
          <h2>2. Paid services</h2>

          <p>
            If paid subscriptions or services are introduced, the applicable
            price, billing period, renewal terms, cancellation process, and
            refund conditions will be presented before purchase.
          </p>
        </section>

        <section>
          <h2>3. Cancellation</h2>

          <p>
            Users should be provided with a clear method to cancel recurring
            services where recurring billing is offered.
          </p>
        </section>

        <section>
          <h2>4. Refund requests</h2>

          <p>
            Refund eligibility will depend on the applicable purchase terms,
            payment provider rules, and applicable law.
          </p>
        </section>

        <section>
          <h2>5. Contact</h2>

          <p>
            Billing questions:
          </p>

          <p>
            <strong>[BILLING CONTACT EMAIL]</strong>
          </p>
        </section>
      </div>
    </main>
  );
};

export default RefundPolicy;