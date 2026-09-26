import { useEffect, useState } from "react";

import {
  acceptAllConsent,
  getConsent,
  hasConsentChoice,
  rejectOptionalConsent,
  saveConsent,
} from "../utils/consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const loadConsent = () => {
      try {
        const consent = getConsent();

        setAnalytics(Boolean(consent?.analytics));
        setMarketing(Boolean(consent?.marketing));

        if (!hasConsentChoice()) {
          setVisible(true);
        }
      } catch (error) {
        console.error("Failed to load cookie consent:", error);

        // If consent data cannot be read, show the banner
        // so the user can make an explicit choice.
        setVisible(true);
      }
    };

    loadConsent();
  }, []);

  const handleAcceptAll = () => {
    try {
      acceptAllConsent();

      setVisible(false);
      setShowPreferences(false);
    } catch (error) {
      console.error("Failed to save all-consent choice:", error);
    }
  };

  const handleReject = () => {
    try {
      rejectOptionalConsent();

      setAnalytics(false);
      setMarketing(false);

      setVisible(false);
      setShowPreferences(false);
    } catch (error) {
      console.error("Failed to save consent choice:", error);
    }
  };

  const handleSavePreferences = () => {
    try {
      saveConsent({
        necessary: true,
        analytics,
        marketing,
      });

      setVisible(false);
      setShowPreferences(false);
    } catch (error) {
      console.error("Failed to save consent preferences:", error);
    }
  };

  const handleManagePreferences = () => {
    setShowPreferences(true);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="cookie-banner-content">

        <h2 id="cookie-banner-title">
          Privacy & Cookie Choices
        </h2>

        <p id="cookie-banner-description">
          SmartExpense uses necessary storage to operate the
          application. Optional analytics and marketing technologies
          are used only when you provide consent.
        </p>

        {showPreferences && (
          <div
            className="cookie-preferences"
            aria-label="Cookie preferences"
          >

            {/* Necessary Cookies */}
            <label className="consent-option">
              <input
                type="checkbox"
                checked
                disabled
                aria-label="Necessary cookies"
              />

              <span>
                <strong>Necessary</strong>

                <small>
                  Required for authentication, security, and core
                  application functionality.
                </small>
              </span>
            </label>

            {/* Analytics Cookies */}
            <label className="consent-option">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) =>
                  setAnalytics(event.target.checked)
                }
                aria-label="Analytics cookies"
              />

              <span>
                <strong>Analytics</strong>

                <small>
                  Helps us understand application usage and improve
                  the product.
                </small>
              </span>
            </label>

            {/* Marketing Cookies */}
            <label className="consent-option">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) =>
                  setMarketing(event.target.checked)
                }
                aria-label="Marketing cookies"
              />

              <span>
                <strong>Marketing</strong>

                <small>
                  Allows optional marketing or advertising
                  technologies.
                </small>
              </span>
            </label>

          </div>
        )}

        <div className="cookie-actions">

          <button
            type="button"
            onClick={handleAcceptAll}
          >
            Accept all
          </button>

          <button
            type="button"
            onClick={handleReject}
          >
            Reject optional cookies
          </button>

          {!showPreferences ? (
            <button
              type="button"
              className="secondary-button"
              onClick={handleManagePreferences}
            >
              Manage preferences
            </button>
          ) : (
            <button
              type="button"
              className="secondary-button"
              onClick={handleSavePreferences}
            >
              Save preferences
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default CookieBanner;