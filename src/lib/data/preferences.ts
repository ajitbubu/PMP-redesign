import { ShieldCheck, Undo2, Clock, FileText } from "lucide-react";
import type { PreferenceChannel, PreferenceRecord, StatTile } from "@/lib/types";

/**
 * Preference stat tiles. "Total Preference" leads here (21 across 5 consent),
 * and the other labels are preference-scoped — distinct from the consent-scoped
 * numbers on the Consent page, so identical labels no longer show contradictory
 * values (design-review T2 fix).
 */
export const preferenceStats: StatTile[] = [
  {
    label: "Total Preferences",
    value: 21,
    icon: ShieldCheck,
    accent: "violet",
    caption: "across 5 consent",
  },
  { label: "Withdrawn Preferences", value: 2, icon: Undo2, accent: "neutral" },
  { label: "Expired Preferences", value: 4, icon: Clock, accent: "warning" },
  { label: "Active Preferences", value: 15, icon: FileText, accent: "info" },
];

export const preferenceChannels: PreferenceChannel[] = [
  { slug: "email", name: "Email", count: 7 },
  { slug: "sms-channel", name: "SMS Channel", count: 3 },
  { slug: "phone-call", name: "Phone Call", count: 1 },
  { slug: "whatsapp", name: "WhatsApp", count: 3 },
];

/** Unique preference records (design-review T1 fix — no repeated rows). */
export const preferenceRecords: PreferenceRecord[] = [
  {
    id: "PRF-2026-0501",
    channelSlug: "email",
    group: "Loan Issuance",
    purpose: "Legitimate Interest",
    status: "Active",
    expiry: "2030-11-20",
  },
  {
    id: "PRF-2026-0502",
    channelSlug: "email",
    group: "IVF Treatment & Care",
    purpose: "Contractual Obligation",
    status: "Active",
    expiry: "2029-08-09",
  },
  {
    id: "PRF-2026-0503",
    channelSlug: "email",
    group: "KYC Consent",
    purpose: "Legal Obligation",
    status: "Active",
    expiry: "2031-01-10",
  },
  {
    id: "PRF-2026-0504",
    channelSlug: "email",
    group: "Guardian Approval",
    purpose: "Legal Obligation",
    status: "Active",
    expiry: "2030-02-28",
  },
  {
    id: "PRF-2026-0505",
    channelSlug: "email",
    group: "Issuance KYC",
    purpose: "Legal Obligation",
    status: "Withdrawn",
    expiry: "2027-06-30",
  },
  {
    id: "PRF-2026-0506",
    channelSlug: "email",
    group: "Loan Issuance",
    purpose: "Marketing Offers",
    status: "Active",
    expiry: "2028-03-22",
  },
  {
    id: "PRF-2026-0507",
    channelSlug: "email",
    group: "IVF Treatment & Care",
    purpose: "Analytics",
    status: "Expired",
    expiry: "2026-04-15",
  },
  {
    id: "PRF-2026-0510",
    channelSlug: "sms-channel",
    group: "Loan Issuance",
    purpose: "Legitimate Interest",
    status: "Active",
    expiry: "2029-06-14",
  },
  {
    id: "PRF-2026-0511",
    channelSlug: "sms-channel",
    group: "IVF Treatment & Care",
    purpose: "Legitimate Interest",
    status: "Active",
    expiry: "2028-12-01",
  },
  {
    id: "PRF-2026-0512",
    channelSlug: "sms-channel",
    group: "KYC Consent",
    purpose: "Contractual Obligation",
    status: "Active",
    expiry: "2029-07-19",
  },
  {
    id: "PRF-2026-0520",
    channelSlug: "phone-call",
    group: "Loan Issuance",
    purpose: "Legitimate Interest",
    status: "Active",
    expiry: "2028-01-31",
  },
  {
    id: "PRF-2026-0530",
    channelSlug: "whatsapp",
    group: "Loan Issuance",
    purpose: "Legitimate Interest",
    status: "Active",
    expiry: "2028-01-31",
  },
  {
    id: "PRF-2026-0531",
    channelSlug: "whatsapp",
    group: "IVF Treatment & Care",
    purpose: "Communication",
    status: "Active",
    expiry: "2028-12-01",
  },
  {
    id: "PRF-2026-0532",
    channelSlug: "whatsapp",
    group: "Loan Issuance",
    purpose: "Marketing Offers",
    status: "Withdrawn",
    expiry: "2027-09-01",
  },
];

export function getPreferenceChannel(slug: string): PreferenceChannel | undefined {
  return preferenceChannels.find((c) => c.slug === slug);
}

export function getPreferenceRecords(slug: string): PreferenceRecord[] {
  return preferenceRecords.filter((r) => r.channelSlug === slug);
}
