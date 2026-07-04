"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  History,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { AuditLogDrawer } from "@/components/shared/audit-log-drawer";
import { formatDate } from "@/lib/utils";
import type { PreferenceRecord } from "@/lib/types";

/** Per-item legal disclosure — derived from the record's own group, not a shared placeholder. */
function legalText(record: PreferenceRecord) {
  return {
    summary: `Detailed legal text for ${record.group} regarding consent requirements and data processing.`,
    disclosure: `Mandatory legal disclosure for ${record.group} compliance under applicable data protection law.`,
  };
}

const DEFAULT_OPTIONS = ["Explicit", "Opt-in", "Opt-out"] as const;

function defaultOption(record: PreferenceRecord) {
  return DEFAULT_OPTIONS[record.id.length % DEFAULT_OPTIONS.length];
}

/** Per-item sub-toggles — derived from the record's own purpose/status. */
function preferenceToggles(record: PreferenceRecord) {
  return [
    { label: "Email alerts", active: record.status === "Active", mandatory: true },
    { label: "SMS channel", active: record.status === "Active", mandatory: true },
    { label: "Push notification", active: false, mandatory: true },
  ];
}

/** Per-channel preference records: searchable, responsive table with row detail. */
export function PreferenceDetail({
  channelName,
  records,
}: {
  channelName: string;
  records: PreferenceRecord[];
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const [auditLogRecord, setAuditLogRecord] = useState<PreferenceRecord | null>(null);

  function isOn(record: PreferenceRecord) {
    return toggled[record.id] ?? record.status === "Active";
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((record) =>
      [record.group, record.purpose, record.status, record.id]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, records]);

  const clearFilters = () => setQuery("");

  return (
    <Card className="p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <Label htmlFor="preference-search" className="sr-only">
            Search {channelName} preferences
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="preference-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by consent group, consent..."
              className="pl-9"
            />
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" className="shrink-0">
          <SlidersHorizontal aria-hidden="true" />
          Filters
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Preferences Found"
          description={`No preference records match "${query}" for the ${channelName} channel.`}
          action={
            <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          {/* lg+ : full table with expandable rows */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consents Group</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Audit Log</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => {
                  const isOpen = expanded === record.id;
                  return (
                    <PreferenceRowGroup
                      key={record.id}
                      record={record}
                      isOpen={isOpen}
                      isOn={isOn(record)}
                      onToggleExpand={() =>
                        setExpanded((current) => (current === record.id ? null : record.id))
                      }
                      onToggleOn={(checked) =>
                        setToggled((prev) => ({ ...prev, [record.id]: checked }))
                      }
                      onOpenAuditLog={() => setAuditLogRecord(record)}
                      colSpan={6}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* < lg : collapsed cards with per-row expand */}
          <ul className="divide-y divide-border lg:hidden">
            {filtered.map((record) => {
              const isOpen = expanded === record.id;
              return (
                <li key={record.id} className="py-3">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setExpanded((current) =>
                        current === record.id ? null : record.id,
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 rounded-md px-1 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-foreground">
                        {record.group}
                      </span>
                    </span>
                    <StatusBadge status={record.status} />
                    <ChevronDown
                      className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen ? (
                    <PreferenceExpandedDetail
                      record={record}
                      isOn={isOn(record)}
                      onToggleOn={(checked) =>
                        setToggled((prev) => ({ ...prev, [record.id]: checked }))
                      }
                      onOpenAuditLog={() => setAuditLogRecord(record)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {auditLogRecord ? (
        <AuditLogDrawer
          open={!!auditLogRecord}
          onOpenChange={(open) => !open && setAuditLogRecord(null)}
          itemName={auditLogRecord.group}
        />
      ) : null}
    </Card>
  );
}

function PreferenceRowGroup({
  record,
  isOpen,
  isOn,
  onToggleExpand,
  onToggleOn,
  onOpenAuditLog,
  colSpan,
}: {
  record: PreferenceRecord;
  isOpen: boolean;
  isOn: boolean;
  onToggleExpand: () => void;
  onToggleOn: (checked: boolean) => void;
  onOpenAuditLog: () => void;
  colSpan: number;
}) {
  return (
    <>
      <TableRow>
        <TableCell className="font-semibold text-foreground">
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={onToggleExpand}
            className="text-left hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1"
          >
            {record.group}
          </button>
        </TableCell>
        <TableCell className="text-muted-foreground">{record.purpose}</TableCell>
        <TableCell>
          <StatusBadge status={record.status} />
        </TableCell>
        <TableCell className="text-muted-foreground">{formatDate(record.expiry)}</TableCell>
        <TableCell>
          <button
            type="button"
            onClick={onOpenAuditLog}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <History className="size-4" aria-hidden="true" />
            Audit Log
          </button>
        </TableCell>
        <TableCell>
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={isOpen}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View All Consents
            <ChevronDown
              className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </TableCell>
      </TableRow>
      {isOpen ? (
        <TableRow>
          <TableCell colSpan={colSpan} className="bg-secondary/30">
            <PreferenceExpandedDetail
              record={record}
              isOn={isOn}
              onToggleOn={onToggleOn}
              onOpenAuditLog={onOpenAuditLog}
              showHeaderActions={false}
            />
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}

function PreferenceExpandedDetail({
  record,
  isOn,
  onToggleOn,
  onOpenAuditLog,
  showHeaderActions = true,
}: {
  record: PreferenceRecord;
  isOn: boolean;
  onToggleOn: (checked: boolean) => void;
  onOpenAuditLog: () => void;
  showHeaderActions?: boolean;
}) {
  const legal = legalText(record);

  return (
    <div className={showHeaderActions ? "mt-2 rounded-md bg-muted/40 px-3 py-3 text-sm" : "text-sm"}>
      {showHeaderActions ? (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
          <button
            type="button"
            onClick={onOpenAuditLog}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <History className="size-4" aria-hidden="true" />
            Audit Log
          </button>
          <Switch checked={isOn} onCheckedChange={onToggleOn} aria-label={`Toggle ${record.group}`} />
        </div>
      ) : (
        <div className="flex items-center justify-end">
          <Switch checked={isOn} onCheckedChange={onToggleOn} aria-label={`Toggle ${record.group}`} />
        </div>
      )}

      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex justify-between gap-4 sm:block">
          <dt className="text-muted-foreground">Purpose</dt>
          <dd className="text-right font-medium text-foreground sm:mt-0.5 sm:text-left">
            {record.purpose}
          </dd>
        </div>
        <div className="flex justify-between gap-4 sm:block">
          <dt className="text-muted-foreground">Default Option</dt>
          <dd className="text-right font-medium text-foreground sm:mt-0.5 sm:text-left">
            {defaultOption(record)}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-foreground">{legal.summary}</p>
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
              <p className="text-sm font-semibold text-foreground">{pref.label}</p>
              <p className="text-xs text-muted-foreground">{pref.active ? "Active" : "Disabled"}</p>
            </div>
            {pref.mandatory ? (
              <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-semibold uppercase text-muted-foreground">
                Mandatory
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
