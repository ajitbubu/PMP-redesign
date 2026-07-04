import type { LucideIcon } from "lucide-react";

/* ----------------------------- Navigation ----------------------------- */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Extra hrefs that should also mark this item active (drill-downs). */
  matches?: string[];
}

/* ------------------------------ Statuses ------------------------------ */
export type RequestStatus = "In Progress" | "Pending" | "Completed" | "Rejected";
export type ConsentState = "Active" | "Withdrawn" | "Expired" | "Expiring Soon";

/* --------------------------- Stat tile accent -------------------------- */
export type TileAccent = "info" | "success" | "warning" | "violet" | "danger" | "neutral";

export interface StatTile {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: TileAccent;
  /** Optional secondary caption, e.g. "across 5 consent". */
  caption?: string;
  /** Optional delta chip, e.g. "+12%". */
  delta?: string;
  /** Optional sub-line under the value, e.g. "Avg SLA 13 days". */
  hint?: string;
}

/* ------------------------------- Consent ------------------------------ */
export type ConsentPurpose =
  | "Necessary"
  | "Analytics"
  | "Communication"
  | "Marketing Offers"
  | "Legal Obligation"
  | "Legitimate Interest"
  | "Contractual Obligation";

export interface ConsentGroup {
  slug: string;
  name: string;
  count: number;
  isNew?: boolean;
}

export interface ConsentRecord {
  id: string;
  groupSlug: string;
  name: string;
  purpose: ConsentPurpose;
  category: "Necessary" | "Analytics" | "Communication" | "Marketing Offers";
  state: Exclude<ConsentState, "Expiring Soon">;
  /** Legal capture basis — drives the "Consent State" filter. */
  consentState: "Opt-in" | "Opt-out" | "Explicit";
  channel: "Email" | "SMS" | "WhatsApp" | "Phone Call" | "In-app message" | "Push Notification";
  expiry: string;
}

/* ----------------------------- Preferences ---------------------------- */
export interface PreferenceChannel {
  slug: string;
  name: string;
  count: number;
}

export interface PreferenceRecord {
  id: string;
  channelSlug: string;
  group: string;
  purpose: ConsentPurpose;
  status: "Active" | "Withdrawn" | "Expired";
  expiry: string;
}

/* -------------------------- Rights (DPAR/DSAR) ------------------------ */
export type RightsKind = "dpar" | "dsar";
export type RightsRequestType =
  | "Access"
  | "Erasure"
  | "Rectification"
  | "Portability"
  | "Restriction"
  | "Opt-Out";

export interface RightsRequest {
  id: string;
  type: RightsRequestType;
  status: RequestStatus;
  submittedOn: string;
  completedOn: string | null;
  slaUsedDays: number;
  slaTotalDays: number;
}

/* -------------------------------- PIA -------------------------------- */
export type PiaStatus = "In Progress" | "Completed" | "Pending";

export interface PiaAttentionItem {
  id: string;
  name: string;
  badge: { label: string; tone: "danger" | "warning" | "info" };
  description: string;
  progress: number; // 0-100
  action: "Resume" | "Start";
  icon: LucideIcon;
  iconAccent: TileAccent;
}

export interface PiaAssessment {
  id: string;
  name: string;
  organization: string;
  department: string;
  ownerName: string;
  ownerInitials: string;
  country: string;
  status: PiaStatus;
  requestType: string;
  privacyTeam: string;
  createdDate: string;
  dueDate: string;
}

/* ------------------------------ Profile ------------------------------ */
export interface ProfileField {
  label: string;
  value: string;
  /** Sensitive fields render behind a Show/Hide toggle. */
  sensitive?: boolean;
  /** Rendered as a select-style field (matches Figma). */
  kind?: "text" | "select" | "date";
  required?: boolean;
}

export interface UserProfile {
  fullName: string;
  userId: string;
  avatarUrl: string;
  identity: ProfileField[];
  guardian: ProfileField[];
  language: string;
}

/* ------------------------------ Audit log ----------------------------- */
export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  from: string;
  to: string;
  timeLabel: string;
}

/* --------------------------- Notifications --------------------------- */
export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  group: "Today" | "Yesterday" | string;
  unread: boolean;
}

export interface QuickNotification {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  icon: LucideIcon;
}

/* --------------------------- Dashboard misc -------------------------- */
export interface SuggestedAction {
  id: string;
  category: string;
  title: string;
  href: string;
  icon: LucideIcon;
  accent: TileAccent;
}

export interface CurrentUser {
  firstName: string;
  fullName: string;
  shortName: string;
  avatarUrl: string;
}
