const PricingDisclosure = () => {
  return (
    <section
      className="legal-section"
      aria-labelledby="pricing-disclosure-title"
    >
      <h2 id="pricing-disclosure-title">Pricing disclosure</h2>

      <p>
        SmartExpense currently displays pricing information only where
        applicable to the services offered.
      </p>

      <ul>
        <li>Prices must be displayed clearly before purchase.</li>
        <li>Applicable taxes or additional charges must be disclosed.</li>
        <li>
          Recurring subscriptions must clearly identify their billing
          frequency.
        </li>
        <li>
          Promotional prices must identify relevant eligibility and duration.
        </li>
        <li>
          A promotional price must not be presented as the permanent price
          when it is temporary.
        </li>
      </ul>

      <p>
        No paid feature should be represented as free if payment is required
        to access it.
      </p>
    </section>
  );
};

export default PricingDisclosure;