"use client";

import { Fragment, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, History } from "lucide-react";
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
import {
  ConsentFilterPanel,
  defaultConsentPanelFilters,
  type ConsentPanelFilters,
} from "@/components/sections/consent/consent-filter-panel";
import { consentCategories } from "@/lib/data/consents";
import { formatDate, cn } from "@/lib/utils";
import type { ConsentRecord } from "@/lib/types";

type Category = (typeof consentCategories)[number];

/** Per-item legal disclosure — derived from the record's own name, not a shared placeholder. */
function legalText(record: ConsentRecord) {
  return {
    summary: `Detailed legal text for ${record.name} regarding consent requirements and data processing.`,
    disclosure: `Mandatory legal disclosure for ${record.name} compliance under applicable data protection law.`,
  };
}

/** Preference sub-toggles shown under a consent's detail — derived from the record's own channel. */
function preferenceToggles(record: ConsentRecord) {
  return [
    { label: `${record.channel} alerts`, active: record.state === "Active", mandatory: true },
    { label: "Push notification", active: false, mandatory: true },
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
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const [auditLogRecord, setAuditLogRecord] = useState<ConsentRecord | null>(null);

  function isOn(record: ConsentRecord) {
    return toggled[record.id] ?? record.state === "Active";
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
    <Card className="mt-6 p-4">
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
                <TableHead>Consent</TableHead>
                <TableHead className="hidden lg:table-cell">Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Channel</TableHead>
                <TableHead className="hidden lg:table-cell">Expiry</TableHead>
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
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() =>
                            setExpandedRow((current) =>
                              current === record.id ? null : record.id,
                            )
                          }
                          className="text-left font-semibold text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1"
                        >
                          {record.name}
                        </button>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {record.id}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{record.purpose}</TableCell>
                      <TableCell>
                        <StatusBadge status={record.state} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{record.channel}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(record.expiry)}
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
                        <Switch
                          checked={isOn(record)}
                          onCheckedChange={(checked) =>
                            setToggled((prev) => ({ ...prev, [record.id]: checked }))
                          }
                          aria-label={`Toggle ${record.name}`}
                        />
                      </TableCell>
                      <TableCell className="lg:hidden text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-expanded={expanded}
                          aria-label={expanded ? "Hide details" : "Show details"}
                          onClick={() =>
                            setExpandedRow((current) =>
                              current === record.id ? null : record.id,
                            )
                          }
                        >
                          <ChevronDown
                            className={cn("transition-transform", expanded && "rotate-180")}
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expanded ? (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-secondary/30">
                          <div className="flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setAuditLogRecord(record)}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <History className="size-4" aria-hidden="true" />
                              Audit Log
                            </button>
                            <Switch
                              checked={isOn(record)}
                              onCheckedChange={(checked) =>
                                setToggled((prev) => ({ ...prev, [record.id]: checked }))
                              }
                              aria-label={`Toggle ${record.name}`}
                            />
                          </div>

                          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Purpose
                              </dt>
                              <dd className="mt-0.5 text-foreground">{record.purpose}</dd>
                            </div>
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Default Option
                              </dt>
                              <dd className="mt-0.5 text-foreground">{record.consentState}</dd>
                            </div>
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Expiry
                              </dt>
                              <dd className="mt-0.5 text-foreground">
                                {formatDate(record.expiry)}
                              </dd>
                            </div>
                          </dl>

                          <p className="mt-3 text-sm text-foreground">{legal.summary}</p>
                          <p className="mt-1.5 rounded-md bg-muted/60 p-2.5 text-xs italic text-muted-foreground">
                            {legal.disclosure}
                          </p>

                          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Preferences
                          </p>
                          <div className="mt-2 space-y-2">
                            {preferenceToggles(record).map((pref) => (
                              <div
                                key={pref.label}
                                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {pref.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {pref.active ? "Active" : "Disabled"}
                                  </p>
                                </div>
                                {pref.mandatory ? (
                                  <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-semibold uppercase text-muted-foreground">
                                    Mandatory
                                  </span>
                                ) : null}
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
        />
      ) : null}
    </Card>
  );
}
