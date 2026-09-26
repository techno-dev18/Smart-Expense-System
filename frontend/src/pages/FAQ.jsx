import FAQ from "../components/FAQ";

const faqItems = [
  {
    question: "What is SmartExpense?",
    answer:
      "SmartExpense is a personal financial organization application for recording income and expenses, managing budgets, and viewing financial analytics.",
  },
  {
    question: "Is SmartExpense financial advice?",
    answer:
      "No. SmartExpense provides organizational tools and informational calculations. It does not replace professional financial, tax, investment, legal, or accounting advice.",
  },
  {
    question: "Can I delete my financial records?",
    answer:
      "Users should be provided with appropriate controls to delete records according to the application's account and data-retention policies.",
  },
  {
    question: "Does SmartExpense use cookies?",
    answer:
      "Necessary storage may be required for core functionality. Optional analytics or marketing technologies should operate according to the user's applicable consent choices.",
  },
  {
    question: "Does SmartExpense sell my financial information?",
    answer:
      "The application should not sell users' financial information. Refer to the Privacy Policy for the actual data-sharing practices of the production service.",
  },
  {
    question: "Is my information completely secure?",
    answer:
      "No internet service can guarantee absolute security. SmartExpense should use appropriate technical and organizational safeguards and continuously improve its security controls.",
  },
  {
    question: "Can I use SmartExpense offline?",
    answer:
      "Some interface elements may remain available offline, but features requiring the backend, database, authentication, or network connection may not work.",
  },
];

const FAQPage = () => {
  return (
    <main id="main-content" className="legal-page">
      <div className="legal-container">
        <p className="legal-label">Help</p>

        <h1>Frequently Asked Questions</h1>

        <p className="legal-intro">
          Find answers to common questions about SmartExpense,
          privacy, security, and usage.
        </p>

        <FAQ items={faqItems} />
      </div>
    </main>
  );
};

export default FAQPage;