import { ShieldCheck, SlidersHorizontal, UserRoundCog, Bell } from "lucide-react";
import type { NotificationItem, QuickNotification, SuggestedAction } from "@/lib/types";

export const suggestedActions: SuggestedAction[] = [
  {
    id: "manage-consent",
    category: "Consent",
    title: "Manage Consent",
    href: "/consent",
    icon: ShieldCheck,
    accent: "info",
  },
  {
    id: "manage-preference",
    category: "Consent",
    title: "Manage Preference",
    href: "/preferences",
    icon: SlidersHorizontal,
    accent: "info",
  },
  {
    id: "submit-request",
    category: "Data Rights",
    title: "Submit a Request",
    href: "/rights/dpar",
    icon: UserRoundCog,
    accent: "info",
  },
];

export const searchSuggestions = [
  "Withdraw marketing consent",
  "Download my data",
  "Update communication preferences",
  "Raise a grievance",
];

export const quickNotifications: QuickNotification[] = [
  {
    id: "qn-1",
    title: "Consent Updates",
    body: "New cookie policy was published successfully.",
    timeLabel: "36 min ago",
    icon: Bell,
  },
  {
    id: "qn-2",
    title: "Preferences Updates",
    body: "Marketing opt-out preferences were synchronized.",
    timeLabel: "36 min ago",
    icon: Bell,
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "n-1",
    title: "Privacy Policy Updated",
    body: "A new version of the Global Privacy Policy (v2.4) is now active for your Student Consent group.",
    timeLabel: "Just now",
    group: "Today",
    unread: true,
  },
  {
    id: "n-2",
    title: "New Data Rights Request",
    body: "Your access request DPR-2026-00042 was received and is now in progress.",
    timeLabel: "1 hour ago",
    group: "Today",
    unread: true,
  },
  {
    id: "n-3",
    title: "Consent Expiring Soon",
    body: "Your marketing consent for the Indira IVF group expires in 14 days. Review it to stay in control.",
    timeLabel: "03:40 PM",
    group: "Yesterday",
    unread: true,
  },
  {
    id: "n-4",
    title: "Consent Renewed",
    body: "Your KYC consent for Loan Issuance was renewed for a further 12 months.",
    timeLabel: "03:20 PM",
    group: "28 Apr",
    unread: false,
  },
];
