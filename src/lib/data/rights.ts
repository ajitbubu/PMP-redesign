import { FileText, Clock, CircleCheck, CircleAlert } from "lucide-react";
import type { RightsKind, RightsRequest, StatTile } from "@/lib/types";

/**
 * DPAR (Data Principal Access Request — India DPDP) and DSAR (Data Subject
 * Access Request — GDPR) share one module/component but keep distinct copy,
 * data and audit trails (design-review decision). IDs are unique per row,
 * fixing the "DSR-2026-00042 × 7" duplication finding.
 */

export interface RightsModuleConfig {
  kind: RightsKind;
  /** Sidebar/segment label. */
  label: string;
  /** Page title, e.g. "My DPR(s)". */
  title: string;
  subtitle: string;
  idPrefix: string;
  stats: StatTile[];
  requests: RightsRequest[];
}

const dparRequests: RightsRequest[] = [
  {
    id: "DPR-2026-00042",
    type: "Access",
    status: "In Progress",
    submittedOn: "2026-03-12",
    completedOn: null,
    slaUsedDays: 12,
    slaTotalDays: 30,
  },
  {
    id: "DPR-2026-00043",
    type: "Erasure",
    status: "Pending",
    submittedOn: "2026-03-10",
    completedOn: null,
    slaUsedDays: 14,
    slaTotalDays: 30,
  },
  {
    id: "DPR-2026-00035",
    type: "Rectification",
    status: "Completed",
    submittedOn: "2026-02-27",
    completedOn: "2026-03-08",
    slaUsedDays: 9,
    slaTotalDays: 30,
  },
  {
    id: "DPR-2026-00045",
    type: "Portability",
    status: "Completed",
    submittedOn: "2026-02-20",
    completedOn: "2026-03-01",
    slaUsedDays: 10,
    slaTotalDays: 30,
  },
  {
    id: "DPR-2026-00076",
    type: "Restriction",
    status: "Rejected",
    submittedOn: "2026-02-11",
    completedOn: "2026-02-16",
    slaUsedDays: 5,
    slaTotalDays: 30,
  },
  {
    id: "DPR-2026-00012",
    type: "Access",
    status: "Completed",
    submittedOn: "2026-02-02",
    completedOn: "2026-02-14",
    slaUsedDays: 12,
    slaTotalDays: 30,
  },
  {
    id: "DPR-2026-00013",
    type: "Erasure",
    status: "Completed",
    submittedOn: "2026-01-21",
    completedOn: "2026-02-05",
    slaUsedDays: 15,
    slaTotalDays: 30,
  },
];

const dsarRequests: RightsRequest[] = [
  {
    id: "DSR-2026-00088",
    type: "Access",
    status: "In Progress",
    submittedOn: "2026-03-14",
    completedOn: null,
    slaUsedDays: 10,
    slaTotalDays: 30,
  },
  {
    id: "DSR-2026-00081",
    type: "Erasure",
    status: "Pending",
    submittedOn: "2026-03-09",
    completedOn: null,
    slaUsedDays: 15,
    slaTotalDays: 30,
  },
  {
    id: "DSR-2026-00074",
    type: "Rectification",
    status: "Completed",
    submittedOn: "2026-02-25",
    completedOn: "2026-03-06",
    slaUsedDays: 9,
    slaTotalDays: 30,
  },
  {
    id: "DSR-2026-00069",
    type: "Portability",
    status: "Completed",
    submittedOn: "2026-02-18",
    completedOn: "2026-02-28",
    slaUsedDays: 10,
    slaTotalDays: 30,
  },
  {
    id: "DSR-2026-00060",
    type: "Restriction",
    status: "Rejected",
    submittedOn: "2026-02-09",
    completedOn: "2026-02-14",
    slaUsedDays: 5,
    slaTotalDays: 30,
  },
  {
    id: "DSR-2026-00051",
    type: "Access",
    status: "Completed",
    submittedOn: "2026-01-30",
    completedOn: "2026-02-11",
    slaUsedDays: 12,
    slaTotalDays: 30,
  },
  {
    id: "DSR-2026-00048",
    type: "Erasure",
    status: "Completed",
    submittedOn: "2026-01-19",
    completedOn: "2026-02-03",
    slaUsedDays: 15,
    slaTotalDays: 30,
  },
];

function statsFor(requests: RightsRequest[]): StatTile[] {
  const total = requests.length;
  const inProgress = requests.filter((r) => r.status === "In Progress").length;
  const completed = requests.filter((r) => r.status === "Completed").length;
  const rejected = requests.filter((r) => r.status === "Rejected").length;
  return [
    { label: "Total Requests", value: total, icon: FileText, accent: "info", delta: "12%", hint: "vs last month" },
    { label: "In Progress", value: inProgress, icon: Clock, accent: "warning", hint: "Avg SLA 13 days" },
    { label: "Completed", value: completed, icon: CircleCheck, accent: "success", delta: "8%" },
    { label: "Rejected", value: rejected, icon: CircleAlert, accent: "danger" },
  ];
}

export const rightsModules: Record<RightsKind, RightsModuleConfig> = {
  dpar: {
    kind: "dpar",
    label: "DPAR",
    title: "My DPR(s)",
    subtitle: "Track every Data Principal request you've submitted in one place.",
    idPrefix: "DPR",
    stats: statsFor(dparRequests),
    requests: dparRequests,
  },
  dsar: {
    kind: "dsar",
    label: "DSAR",
    title: "My DSR(s)",
    subtitle: "Track every Data Subject request you've submitted in one place.",
    idPrefix: "DSR",
    stats: statsFor(dsarRequests),
    requests: dsarRequests,
  },
};

export function getRightsModule(kind: RightsKind): RightsModuleConfig {
  return rightsModules[kind];
}
