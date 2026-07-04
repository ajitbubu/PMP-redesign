/**
 * Consent-to-data-processing notice. Uses a real fiduciary name instead of the
 * "[Client Name]" placeholder, and the acknowledgement copy is de-typo'd
 * (design-review T2/T3). `fiduciaryName` is the single interpolation point —
 * set it per tenant at render time.
 */
export const fiduciaryName = "Indira IVF";

export const consentNotice = {
  title: "Consent to Data Processing",
  intro: [
    `Welcome to the Privacy Management Platform (“PMP”) powered by Data Safeguard ID-PRIVACY®.`,
    `${fiduciaryName} providing the product or service (“Data Fiduciary”) may process your personal data through this platform for user authentication, consent and cookie preference management, Data Principal rights handling, grievance redressal, security monitoring, audit logging, and regulatory compliance purposes.`,
    `*Data Safeguard provides the platform technology and does not independently access, store, use, control or process your personal data for its own purposes; such decisions remain with the Data Fiduciary.`,
    `Depending on the services and purposes communicated by the Data Fiduciary, personal data processed may include name, mobile number, email address, customer/account ID, device/browser metadata, IP address, consent records, cookie preferences, Data Rights request details, grievance submissions, and platform activity logs.`,
    `Strictly necessary cookies required for authentication, platform security and session continuity may continue to operate as part of essential platform functionality. Non-essential cookies and similar tracking technologies will operate based on your selected preferences.`,
    `After login, you may manage consent and preferences, submit Data Principal Rights requests, raise grievances and/or manage third-party risk assessment directly within the PMP.`,
  ],
  acknowledgements: [
    "I have read and understood the Privacy Notice and understand how my personal data will be processed through this platform.",
    "I understand that I may review, manage, or withdraw my consent and cookie preferences at any time.",
    "I understand that I may submit Data Principal Rights requests or raise privacy grievances through the mechanisms provided within the Platform.",
  ],
  footerLinks: [
    { label: "Privacy Notice", href: "#privacy-notice" },
    { label: "Cookie Notice", href: "#cookie-notice" },
    { label: "Grievance Redressal / Contact DPO", href: "#grievance" },
  ],
} as const;
