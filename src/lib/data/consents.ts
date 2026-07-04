import { FileText, Undo2, Clock, ShieldCheck } from "lucide-react";
import type { ConsentGroup, ConsentRecord, StatTile } from "@/lib/types";

/**
 * Consent stat tiles. Labels are entity-scoped ("Active Consents",
 * "Withdrawn Consents", "Expired Consents") so they never collide with the
 * Preferences page's differently-scoped counts. "Withdrawn" uses a neutral
 * accent + revert icon — it's a user-initiated reversal, not a success.
 */
export const consentStats: StatTile[] = [
  { label: "Active Consents", value: 122, icon: FileText, accent: "info" },
  { label: "Withdrawn Consents", value: 12, icon: Undo2, accent: "neutral" },
  { label: "Expired Consents", value: 4, icon: Clock, accent: "warning" },
  {
    label: "Total Preferences",
    value: 21,
    icon: ShieldCheck,
    accent: "violet",
    caption: "across 5 consent",
  },
];

export const consentGroups: ConsentGroup[] = [
  { slug: "loan-issuance", name: "Loan Issuance", count: 7, isNew: true },
  { slug: "ivf-treatment-care", name: "IVF Treatment & Care", count: 3, isNew: true },
  { slug: "guardian-approval", name: "Guardian Approval", count: 1, isNew: true },
  { slug: "kyc-consent", name: "KYC Consent", count: 3 },
  { slug: "issuance-kyc", name: "Issuance KYC", count: 1 },
];

/** Realistic, non-duplicated consent records (design-review T1 fix). */
export const consentRecords: ConsentRecord[] = [
  {
    id: "CNS-2026-04101",
    groupSlug: "loan-issuance",
    name: "Credit Score Retrieval",
    purpose: "Legal Obligation",
    category: "Necessary",
    state: "Active",
    consentState: "Explicit",
    channel: "Email",
    expiry: "2030-11-20",
  },
  {
    id: "CNS-2026-04102",
    groupSlug: "loan-issuance",
    name: "Income Verification Sharing",
    purpose: "Contractual Obligation",
    category: "Necessary",
    state: "Active",
    consentState: "Explicit",
    channel: "SMS",
    expiry: "2029-06-14",
  },
  {
    id: "CNS-2026-04103",
    groupSlug: "loan-issuance",
    name: "Repayment Reminders",
    purpose: "Legitimate Interest",
    category: "Communication",
    state: "Active",
    consentState: "Opt-in",
    channel: "WhatsApp",
    expiry: "2026-11-30",
  },
  {
    id: "CNS-2026-04104",
    groupSlug: "loan-issuance",
    name: "Loan Offer Marketing",
    purpose: "Marketing Offers",
    category: "Marketing Offers",
    state: "Withdrawn",
    consentState: "Opt-out",
    channel: "Email",
    expiry: "2027-09-01",
  },
  {
    id: "CNS-2026-04105",
    groupSlug: "loan-issuance",
    name: "Behavioural Analytics",
    purpose: "Legitimate Interest",
    category: "Analytics",
    state: "Expired",
    consentState: "Opt-out",
    channel: "In-app message",
    expiry: "2026-02-10",
  },
  {
    id: "CNS-2026-04106",
    groupSlug: "loan-issuance",
    name: "Partner Cross-Sell Offers",
    purpose: "Marketing Offers",
    category: "Marketing Offers",
    state: "Active",
    consentState: "Opt-in",
    channel: "Push Notification",
    expiry: "2027-03-22",
  },
  {
    id: "CNS-2026-04107",
    groupSlug: "loan-issuance",
    name: "Fraud Monitoring",
    purpose: "Legal Obligation",
    category: "Necessary",
    state: "Active",
    consentState: "Explicit",
    channel: "Email",
    expiry: "2031-05-18",
  },
  {
    id: "CNS-2026-03310",
    groupSlug: "ivf-treatment-care",
    name: "Clinical Records Access",
    purpose: "Contractual Obligation",
    category: "Necessary",
    state: "Active",
    consentState: "Explicit",
    channel: "Email",
    expiry: "2030-08-09",
  },
  {
    id: "CNS-2026-03311",
    groupSlug: "ivf-treatment-care",
    name: "Appointment Notifications",
    purpose: "Legitimate Interest",
    category: "Communication",
    state: "Active",
    consentState: "Opt-in",
    channel: "SMS",
    expiry: "2026-12-01",
  },
  {
    id: "CNS-2026-03312",
    groupSlug: "ivf-treatment-care",
    name: "Research Data Sharing",
    purpose: "Analytics",
    category: "Analytics",
    state: "Withdrawn",
    consentState: "Opt-out",
    channel: "Email",
    expiry: "2027-04-15",
  },
  {
    id: "CNS-2026-02201",
    groupSlug: "guardian-approval",
    name: "Guardian Verification",
    purpose: "Legal Obligation",
    category: "Necessary",
    state: "Active",
    consentState: "Explicit",
    channel: "Email",
    expiry: "2030-02-28",
  },
  {
    id: "CNS-2026-01150",
    groupSlug: "kyc-consent",
    name: "Identity Document Storage",
    purpose: "Legal Obligation",
    category: "Necessary",
    state: "Active",
    consentState: "Explicit",
    channel: "Email",
    expiry: "2031-01-10",
  },
  {
    id: "CNS-2026-01151",
    groupSlug: "kyc-consent",
    name: "Address Proof Verification",
    purpose: "Contractual Obligation",
    category: "Necessary",
    state: "Active",
    consentState: "Opt-in",
    channel: "SMS",
    expiry: "2029-07-19",
  },
  {
    id: "CNS-2026-01152",
    groupSlug: "kyc-consent",
    name: "Sanctions Screening",
    purpose: "Legal Obligation",
    category: "Necessary",
    state: "Active",
    consentState: "Explicit",
    channel: "Email",
    expiry: "2030-10-05",
  },
  {
    id: "CNS-2026-00980",
    groupSlug: "issuance-kyc",
    name: "Card Issuance KYC",
    purpose: "Legal Obligation",
    category: "Necessary",
    state: "Active",
    consentState: "Explicit",
    channel: "Email",
    expiry: "2030-06-30",
  },
];

export const consentCategories = [
  "All",
  "Necessary",
  "Analytics",
  "Communication",
  "Marketing Offers",
] as const;

export function getConsentGroup(slug: string): ConsentGroup | undefined {
  return consentGroups.find((g) => g.slug === slug);
}

export function getConsentRecords(slug: string): ConsentRecord[] {
  return consentRecords.filter((r) => r.groupSlug === slug);
}
