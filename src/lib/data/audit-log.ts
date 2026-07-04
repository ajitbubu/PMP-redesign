import type { AuditLogEntry } from "@/lib/types";

/** Change timeline shown in the Audit Log drawer. Same shape for any consent/preference item. */
export function getAuditLog(): AuditLogEntry[] {
  return [
    {
      id: "1",
      actor: "System",
      action: "Regulatory Update",
      from: "v1.2 Policy",
      to: "v1.3 GDPR Update",
      timeLabel: "1 hour ago",
    },
    {
      id: "2",
      actor: "Admin User (You)",
      action: "Toggle Enabled",
      from: "Opt-in",
      to: "Opt-out",
      timeLabel: "4 hours ago",
    },
    {
      id: "3",
      actor: "System",
      action: "Regulatory Update",
      from: "v1.1 Policy",
      to: "v1.3 GDPR Update",
      timeLabel: "91 days ago",
    },
  ];
}
