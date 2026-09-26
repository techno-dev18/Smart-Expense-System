import { useEffect, useState } from "react";
import { getConsent } from "../utils/consent";

const TrackingConsent = () => {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const updateConsent = () => {
      const consent = getConsent();

      setAnalyticsAllowed(Boolean(consent.analytics));
    };

    updateConsent();

    window.addEventListener(
      "smartExpenseConsentChanged",
      updateConsent
    );

    return () => {
      window.removeEventListener(
        "smartExpenseConsentChanged",
        updateConsent
      );
    };
  }, []);

  useEffect(() => {
    if (!analyticsAllowed) {
      return;
    }

    /*
      Initialize your analytics provider here.

      Example:

      analytics.initialize(...);

      Do NOT initialize optional analytics before
      the required consent has been obtained.
    */
  }, [analyticsAllowed]);

  return null;
};

export default TrackingConsent;