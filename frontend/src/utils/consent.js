const CONSENT_STORAGE_KEY = "smartExpenseConsent";

const defaultConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export const getConsent = () => {
  try {
    const storedConsent = localStorage.getItem(
      CONSENT_STORAGE_KEY
    );

    if (!storedConsent) {
      return { ...defaultConsent };
    }

    const parsedConsent = JSON.parse(storedConsent);

    return {
      necessary: true,
      analytics: Boolean(parsedConsent.analytics),
      marketing: Boolean(parsedConsent.marketing),
    };
  } catch (error) {
    console.error("Unable to read consent:", error);

    return { ...defaultConsent };
  }
};

export const saveConsent = (consent = {}) => {
  const finalConsent = {
    necessary: true,
    analytics: Boolean(consent.analytics),
    marketing: Boolean(consent.marketing),
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify(finalConsent)
  );

  return finalConsent;
};

export const acceptAllConsent = () => {
  return saveConsent({
    necessary: true,
    analytics: true,
    marketing: true,
  });
};

export const rejectOptionalConsent = () => {
  return saveConsent({
    necessary: true,
    analytics: false,
    marketing: false,
  });
};

export const hasConsentChoice = () => {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) !== null;
  } catch (error) {
    console.error("Unable to check consent:", error);

    return false;
  }
};

export const clearConsent = () => {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    console.error("Unable to clear consent:", error);
  }
};