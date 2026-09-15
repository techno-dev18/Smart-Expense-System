import { useState } from "react";

import "../styles/contact.css";

function Contact() {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  const [submitted, setSubmitted] =
    useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
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
            Have a question, suggestion, or
            feedback about SmartExpense?
            Send us a message.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-info">
          <span className="contact-eyebrow">
            CONTACT US
          </span>

          <h2>
            Let's start a conversation.
          </h2>

          <p>
            Whether you need help with the
            application or want to share feedback,
            we're here to listen.
          </p>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                @
              </div>

              <div>
                <span>Email</span>
                <strong>
                  support@smartexpense.com
                </strong>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                ?
              </div>

              <div>
                <span>Support</span>
                <strong>
                  We're here to help
                </strong>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                +
              </div>

              <div>
                <span>Feedback</span>
                <strong>
                  Help us improve SmartExpense
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {submitted ? (
            <div className="contact-success">
              <div className="contact-success-icon">
                ✓
              </div>

              <h3>
                Message received
              </h3>

              <p>
                Thank you for contacting us.
                We'll get back to you soon.
              </p>

              <button
                type="button"
                onClick={() =>
                  setSubmitted(false)
                }
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name">
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="subject">
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="7"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default Contact;