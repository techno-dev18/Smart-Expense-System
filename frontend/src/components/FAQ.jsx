import { useState } from "react";

const FAQ = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const answerId = `faq-answer-${index}`;

        return (
          <div className="faq-item" key={item.question}>
            <h2 className="faq-question">
              <button
                type="button"
                className="faq-button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggleFAQ(index)}
              >
                <span>{item.question}</span>
                <span aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h2>

            <div
              id={answerId}
              className={`faq-answer ${
                isOpen ? "faq-answer-open" : ""
              }`}
              hidden={!isOpen}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQ;