import { useState } from "react";
import API from "../services/api";

import "../styles/contact.css";

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setError("");

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.message
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (payload.message.length > 5000) {
      setError("Your message cannot exceed 5,000 characters.");
      return;
    }

    try {
      setSubmitting(true);

      await API.post("/contact", payload);

      setFormData(initialFormData);
      setSubmitted(true);
    } catch (requestError) {
      console.error("Contact form error:", requestError);

      setError(
        requestError.response?.data?.message ||
          "We couldn't send your message. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setSubmitted(false);
    setError("");
  };

  return (
    <main className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-eyebrow">
            GET IN TOUCH
          </span>

          <h1>
            We'd love to
            <span> hear from you.</span>
          </h1>

          <p>
            Have a question, suggestion, or feedback about
            SmartExpense? Send us a message. We'd be happy
            to hear from you.
          </p>

          <div className="contact-hero-note">
            <span className="contact-status-dot" />
            We're listening to your feedback.
          </div>
        </div>

        <div className="contact-hero-decoration" aria-hidden="true">
          <div className="contact-decoration-card contact-decoration-card-main">
            <span className="contact-decoration-icon">@</span>
            <div>
              <strong>Let's talk</strong>
              <span>Your feedback matters.</span>
            </div>
          </div>

          <div className="contact-decoration-card contact-decoration-card-small">
            <span className="contact-decoration-check">✓</span>
            <span>Here to help</span>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="contact-section">
        <div className="contact-info">
          <span className="contact-eyebrow">
            CONTACT & SUPPORT
          </span>

          <h2>
            Let's start a conversation.
          </h2>

          <p className="contact-info-description">
            Whether you need help with the application,
            have spotted a problem, or want to suggest a
            new feature, send us a message using the form.
          </p>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <div className="contact-info-icon" aria-hidden="true">
                @
              </div>

              <div>
                <span>Email</span>
                <strong>SmartExpense Support</strong>
                <p>
                  Send your message using the form.
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon" aria-hidden="true">
                ?
              </div>

              <div>
                <span>Application help</span>
                <strong>Need a hand?</strong>
                <p>
                  Tell us what went wrong and what you were
                  trying to do.
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon" aria-hidden="true">
                +
              </div>

              <div>
                <span>Suggestions</span>
                <strong>Help us improve</strong>
                <p>
                  Share ideas that could make SmartExpense
                  more useful.
                </p>
              </div>
            </div>
          </div>

          <div className="contact-privacy-note">
            <span aria-hidden="true">🔒</span>
            <p>
              Please don't include passwords, bank account
              details, or other sensitive financial
              information in your message.
            </p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {submitted ? (
            <div className="contact-success" role="status" aria-live="polite">
              <div className="contact-success-icon" aria-hidden="true">
                ✓
              </div>

              <span className="contact-eyebrow">
                MESSAGE SENT
              </span>

              <h3>Thank you for reaching out!</h3>

              <p>
                Your message was submitted successfully.
                Thank you for helping us improve SmartExpense.
              </p>

              <button
                type="button"
                className="contact-submit"
                onClick={handleSendAnother}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="contact-form-heading">
                <span className="contact-eyebrow">
                  SEND A MESSAGE
                </span>

                <h2>How can we help?</h2>

                <p>
                  Fill in the details below. Fields marked
                  with <span aria-hidden="true">*</span> are required.
                </p>
              </div>

              {error && (
                <div
                  className="contact-error"
                  role="alert"
                  aria-live="assertive"
                >
                  <span aria-hidden="true">!</span>
                  {error}
                </div>
              )}

              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-name">
                      Name <span aria-hidden="true">*</span>
                    </label>

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      autoComplete="name"
                      maxLength={100}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-email">
                      Email <span aria-hidden="true">*</span>
                    </label>

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength={254}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-subject">
                    Subject <span aria-hidden="true">*</span>
                  </label>

                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    maxLength={150}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="contact-field">
                  <div className="contact-message-label">
                    <label htmlFor="contact-message">
                      Message <span aria-hidden="true">*</span>
                    </label>

                    <span>
                      {formData.message.length}/5000
                    </span>
                  </div>

                  <textarea
                    id="contact-message"
                    name="message"
                    rows={7}
                    maxLength={5000}
                    placeholder="Describe your question, issue, or suggestion..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="contact-spinner"
                        aria-hidden="true"
                      />
                      Sending message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>

                <p className="contact-form-footnote">
                  Your message will be sent to the SmartExpense
                  support inbox.
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Contact;