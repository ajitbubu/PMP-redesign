import type { BadgeProps } from "@/components/ui/badge";
import type { RequestStatus, TileAccent } from "@/lib/types";

/** Icon-tile background/foreground classes per accent (all token-derived). */
export const tileAccentClasses: Record<TileAccent, string> = {
  info: "bg-primary text-primary-foreground",
  success: "bg-success text-white",
  warning: "bg-orange-500 text-white",
  violet: "bg-violet-500 text-white",
  danger: "bg-red-100 text-red-600",
  neutral: "bg-gray-500 text-white",
};

/** Soft variant of the tile accent (used for suggested-action / attention icons). */
export const tileAccentSoftClasses: Record<TileAccent, string> = {
  info: "bg-brand-50 text-brand-600",
  success: "bg-green-100 text-green-700",
  warning: "bg-orange-50 text-orange-600",
  violet: "bg-violet-100 text-violet-600",
  danger: "bg-red-100 text-red-600",
  neutral: "bg-gray-100 text-gray-600",
};

/** Map a request/consent status to a Badge variant. */
export function statusBadgeVariant(status: string): NonNullable<BadgeProps["variant"]> {
  switch (status) {
    case "Completed":
    case "Active":
    case "ACTIVE":
      return "success";
    case "In Progress":
      return "info";
    case "Pending":
    case "Expiring Soon":
      return "warning";
    case "Rejected":
    case "Expired":
    case "Withdrawn":
      return "destructive";
    default:
      return "secondary";
  }
}

export const requestStatuses: RequestStatus[] = [
  "In Progress",
  "Pending",
  "Completed",
  "Rejected",
];
