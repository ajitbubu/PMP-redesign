"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  History,
  CheckCircle2,
  Info,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { AuditLogDrawer } from "@/components/shared/audit-log-drawer";
import { ConsentUpdateDialog } from "@/components/sections/consent/consent-update-dialog";
import {
  ConsentFilterPanel,
  defaultConsentPanelFilters,
  type ConsentPanelFilters,
} from "@/components/sections/consent/consent-filter-panel";
import { consentCategories } from "@/lib/data/consents";
import { getAuditLog } from "@/lib/data/audit-log";
import { currentUser } from "@/lib/data/nav";
import { formatDate, cn } from "@/lib/utils";
import type { ConsentRecord, AuditLogEntry } from "@/lib/types";

type Category = (typeof consentCategories)[number];

// Legal consent changes lock the toggle for a cooldown while they propagate.
const COOLDOWN_MS = 25_000;

/** A toggle-on means the consent is granted (Opt-In); off means Opt-Out. */
function initialPermission(record: ConsentRecord): boolean {
  return record.state === "Active";
}

/** Per-item legal disclosure — derived from the record's own name, not a shared placeholder. */
function legalText(record: ConsentRecord) {
  return {
    summary: `Detailed legal text for ${record.name} regarding consent requirements and data processing.`,
    disclosure: `Mandatory legal disclosure for ${record.name} compliance under applicable data protection law.`,
  };
}

type PreferenceToggle = {
  label: string;
  description: string;
  active: boolean;
  mandatory: boolean;
  updated: string;
  highlighted?: boolean;
};

/** Channel preferences shown under a consent's expanded detail. */
function preferenceToggles(record: ConsentRecord): PreferenceToggle[] {
  const on = record.state === "Active";
  return [
    {
      label: "Email alerts",
      description: "Configuration setting for email alerts",
      active: on,
      mandatory: true,
      updated: "12 Jan 2026",
      highlighted: true,
    },
    {
      label: "SMS channel",
      description: "Configuration setting for sms channel",
      active: on,
      mandatory: true,
      updated: "12 Jan 2026",
    },
    {
      label: "Push notification",
      description: "Configuration setting for push notification",
      active: false,
      mandatory: true,
      updated: "12 Jan 2026",
    },
  ];
}

// The product's reference "today" for expiry-window calculations.
const NOW = new Date("2026-07-03T00:00:00Z").getTime();
const EXPIRING_SOON_DAYS = 365;

function isExpiringSoon(record: ConsentRecord): boolean {
  if (record.state !== "Active") return false;
  const days = (new Date(record.expiry).getTime() - NOW) / 86_400_000;
  return days > 0 && days <= EXPIRING_SOON_DAYS;
}

function matchesPanel(record: ConsentRecord, filters: ConsentPanelFilters): boolean {
  if (filters.status === "Active" && record.state !== "Active") return false;
  if (filters.status === "Expiring Soon" && !isExpiringSoon(record)) return false;
  if (filters.purpose !== "All" && record.purpose !== filters.purpose) return false;
  if (filters.consentState !== "All" && record.consentState !== filters.consentState) return false;
  if (filters.preference !== "All" && record.channel !== filters.preference) return false;
  return true;
}

function matchesSearch(record: ConsentRecord, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [record.id, record.name, record.purpose, record.state, record.channel]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function ConsentDetail({
  groupName,
  records,
}: {
  groupName: string;
  records: ConsentRecord[];
}) {
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelFilters, setPanelFilters] = useState<ConsentPanelFilters>(
    defaultConsentPanelFilters,
  );
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [auditLogRecord, setAuditLogRecord] = useState<ConsentRecord | null>(null);

  // Legal-consent permission state: current value, version counter, per-record
  // audit trail, an in-flight change awaiting confirmation, and cooldown locks.
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [versions, setVersions] = useState<Record<string, number>>({});
  const [auditByRecord, setAuditByRecord] = useState<Record<string, AuditLogEntry[]>>({});
  const [pending, setPending] = useState<{ record: ConsentRecord; next: boolean } | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [, setNowTick] = useState(0);

  // Tick once a second while any cooldown is active so countdowns update and
  // toggles re-enable on expiry; the interval clears itself when none remain.
  useEffect(() => {
    if (!Object.values(cooldowns).some((until) => until > Date.now())) return;
    const timer = setInterval(() => {
      setNowTick((n) => n + 1);
      if (!Object.values(cooldowns).some((until) => until > Date.now())) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldowns]);

  function permOf(record: ConsentRecord) {
    return permissions[record.id] ?? initialPermission(record);
  }
  function versionOf(record: ConsentRecord) {
    return versions[record.id] ?? 1;
  }
  function cooldownRemaining(record: ConsentRecord) {
    const until = cooldowns[record.id];
    return until ? Math.max(0, Math.ceil((until - Date.now()) / 1000)) : 0;
  }
  function isCoolingDown(record: ConsentRecord) {
    return cooldownRemaining(record) > 0;
  }
  /** Status reflects a confirmed change; unchanged rows keep their real state (incl. Expired). */
  function displayState(record: ConsentRecord) {
    const on = permOf(record);
    if (on === initialPermission(record)) return record.state;
    return on ? "Active" : "Withdrawn";
  }
  function auditEntriesFor(record: ConsentRecord): AuditLogEntry[] {
    return [...(auditByRecord[record.id] ?? []), ...getAuditLog()];
  }

  /** Toggle click opens the confirmation modal rather than applying immediately. */
  function requestToggle(record: ConsentRecord, next: boolean) {
    if (isCoolingDown(record)) return;
    setPending({ record, next });
  }

  function confirmUpdate(note: string) {
    if (!pending) return;
    const { record, next } = pending;
    const from = permOf(record);
    const newVersion = versionOf(record) + 1;
    const entry: AuditLogEntry = {
      id: `${record.id}-v${newVersion}`,
      actor: `${currentUser.fullName} (You)`,
      action: `Consent ${next ? "Opted In" : "Withdrawn"} · v${newVersion}`,
      from: from ? "Opt-In" : "Opt-Out",
      to: next ? "Opt-In" : "Opt-Out",
      timeLabel: "Just now",
      note: note || undefined,
    };
    setPermissions((prev) => ({ ...prev, [record.id]: next }));
    setVersions((prev) => ({ ...prev, [record.id]: newVersion }));
    setAuditByRecord((prev) => ({ ...prev, [record.id]: [entry, ...(prev[record.id] ?? [])] }));
    setCooldowns((prev) => ({ ...prev, [record.id]: Date.now() + COOLDOWN_MS }));
    setPending(null);
  }

  function toggleExpanded(id: string) {
    setExpandedRow((current) => (current === id ? null : id));
  }

  function renderPermissionToggle(record: ConsentRecord) {
    const cooling = isCoolingDown(record);
    return (
      <div className="flex flex-col items-start gap-1">
        <Switch
          checked={permOf(record)}
          disabled={cooling}
          onCheckedChange={(checked) => requestToggle(record, checked)}
          aria-label={`Toggle ${record.name}`}
        />
        {cooling ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Lock className="size-3" aria-hidden="true" />
            {cooldownRemaining(record)}s
          </span>
        ) : null}
      </div>
    );
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: records.length };
    for (const record of records) {
      counts[record.category] = (counts[record.category] ?? 0) + 1;
    }
    return counts;
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((record) => {
      if (category !== "All" && record.category !== category) return false;
      if (!matchesSearch(record, search)) return false;
      if (!matchesPanel(record, panelFilters)) return false;
      return true;
    });
  }, [records, category, search, panelFilters]);

  function resetAll() {
    setCategory("All");
    setSearch("");
    setPanelFilters(defaultConsentPanelFilters);
  }

  const showEmpty = filtered.length === 0;

  return (
    <Card className="mt-4 p-4">
      {/* Category pill tabs */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Consent categories">
        {consentCategories.map((cat) => {
          const selected = category === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={selected ? "true" : "false"}
              onClick={() => setCategory(cat)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selected
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              {cat}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  selected ? "bg-primary-foreground/20" : "bg-secondary text-muted-foreground",
                )}
              >
                {categoryCounts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by ID, type or status..."
            aria-label="Search consents"
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
        >
          <SlidersHorizontal />
          Filters
        </Button>
      </div>

      {panelOpen ? (
        <ConsentFilterPanel
          filters={panelFilters}
          onChange={setPanelFilters}
          onReset={() => setPanelFilters(defaultConsentPanelFilters)}
        />
      ) : null}

      {/* Table */}
      <div className="mt-4">
        {showEmpty ? (
          <EmptyState
            title="No Consents Found"
            description="We couldn't find any consents matching your current filters."
            action={
              <Button variant="outline" onClick={resetAll}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <Table>
            <caption className="sr-only">{groupName} consents</caption>
            <TableHeader>
              <TableRow>
                <TableHead>Consents</TableHead>
                <TableHead className="hidden lg:table-cell">Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Expiry</TableHead>
                <TableHead className="hidden lg:table-cell">Preferences</TableHead>
                <TableHead className="hidden lg:table-cell">Audit Log</TableHead>
                <TableHead className="hidden lg:table-cell">Actions</TableHead>
                <TableHead className="lg:hidden">
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((record) => {
                const expanded = expandedRow === record.id;
                const legal = legalText(record);
                return (
                  <Fragment key={record.id}>
                    <TableRow>
                      <TableCell>
                        <span className="font-semibold text-primary">{record.name}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {record.description}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{record.purpose}</TableCell>
                      <TableCell>
                        <StatusBadge status={displayState(record)} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(record.expiry)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() => toggleExpanded(record.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            expanded
                              ? "border-primary/40 bg-primary/5 text-primary"
                              : "border-border bg-card text-muted-foreground hover:bg-secondary",
                          )}
                        >
                          Preferences
                          <ChevronDown
                            className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
                          />
                        </button>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <button
                          type="button"
                          onClick={() => setAuditLogRecord(record)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <History className="size-4" aria-hidden="true" />
                          Audit Log
                        </button>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {renderPermissionToggle(record)}
                      </TableCell>
                      <TableCell className="text-right lg:hidden">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-expanded={expanded}
                          aria-label={expanded ? "Hide preferences" : "Show preferences"}
                          onClick={() => toggleExpanded(record.id)}
                        >
                          <ChevronDown
                            className={cn("transition-transform", expanded && "rotate-180")}
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expanded ? (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-secondary/30">
                          {/* Audit Log + toggle surface on mobile, where their
                              own columns are hidden. */}
                          <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
                            <button
                              type="button"
                              onClick={() => setAuditLogRecord(record)}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <History className="size-4" aria-hidden="true" />
                              Audit Log
                            </button>
                            {renderPermissionToggle(record)}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">Default Option</span>
                            <span className="text-sm font-semibold text-foreground">
                              {record.consentState}
                            </span>
                          </div>

                          <p className="mt-3 text-sm text-foreground">{legal.summary}</p>
                          <p className="mt-1.5 rounded-md bg-muted/60 p-2.5 text-xs italic text-muted-foreground">
                            {legal.disclosure}
                          </p>

                          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Preferences
                          </p>
                          <div className="mt-2 space-y-2">
                            {preferenceToggles(record).map((pref) => (
                              <div
                                key={pref.label}
                                className={cn(
                                  "rounded-lg border bg-card p-3",
                                  pref.highlighted ? "border-primary" : "border-border",
                                )}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-foreground">
                                      {pref.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {pref.description}
                                    </p>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-3">
                                    {pref.active ? (
                                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                                        <CheckCircle2 className="size-4" aria-hidden="true" />
                                        Active
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                                        <Info className="size-4" aria-hidden="true" />
                                        Disabled
                                      </span>
                                    )}
                                    {pref.mandatory ? (
                                      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        <Lock className="size-3" aria-hidden="true" />
                                        Mandatory
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                <p className="mt-2.5 border-t border-border pt-2 text-xs text-muted-foreground">
                                  Last updated: {pref.updated}
                                </p>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {auditLogRecord ? (
        <AuditLogDrawer
          open={!!auditLogRecord}
          onOpenChange={(open) => !open && setAuditLogRecord(null)}
          itemName={auditLogRecord.name}
          entries={auditEntriesFor(auditLogRecord)}
        />
      ) : null}

      {pending ? (
        <ConsentUpdateDialog
          record={pending.record}
          nextPermission={pending.next}
          open={pending !== null}
          onOpenChange={(open) => {
            if (!open) setPending(null);
          }}
          onConfirm={confirmUpdate}
        />
      ) : null}
    </Card>
  );
}
