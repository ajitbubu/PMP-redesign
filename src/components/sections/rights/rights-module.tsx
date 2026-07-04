"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  ChevronDown,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { CancelRequestDialog } from "@/components/sections/rights/cancel-request-dialog";
import { cn, formatDate } from "@/lib/utils";
import { getRightsModule, type RightsModuleConfig } from "@/lib/data/rights";
import type { RightsKind, RightsRequest } from "@/lib/types";

const CLOSED_STATUSES = new Set(["Completed", "Rejected"]);

function isClosed(status: string): boolean {
  return CLOSED_STATUSES.has(status);
}

export function RightsModule({ kind }: { kind: RightsKind }) {
  // Resolve config on the client so icon components never cross the RSC boundary.
  const config = getRightsModule(kind);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [toastTitle, setToastTitle] = useState("Report Successfully Emailed");
  const [cancelTarget, setCancelTarget] = useState<RightsRequest | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (searchParams.get("submitted") !== "1") return;
    setToastTitle(`${config.idPrefix} Submitted successfully!`);
    setToast(`The ${config.idPrefix} request has been submitted successfully.`);
    router.replace(pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return config.requests;
    return config.requests.filter((req) =>
      [req.id, req.type, req.status].some((field) => field.toLowerCase().includes(q)),
    );
  }, [config.requests, query]);

  function emailReport() {
    setToastTitle("Report Successfully Emailed");
    setToast("The report has been sent to your registered email.");
  }

  const segments: { kind: RightsModuleConfig["kind"]; label: string; href: string }[] = [
    { kind: "dpar", label: "DPAR", href: "/rights/dpar" },
    { kind: "dsar", label: "DSAR", href: "/rights/dsar" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* Segmented DPAR | DSAR switch */}
      <div className="mb-6 inline-flex rounded-lg border border-border bg-card p-1">
        {segments.map((seg) => {
          const active = seg.kind === config.kind;
          return (
            <Link
              key={seg.kind}
              href={seg.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 min-w-20 items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {seg.label}
            </Link>
          );
        })}
      </div>

      {/* Header row */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {config.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.subtitle}</p>
        </div>
        <Button asChild>
          <Link href={`/rights/${kind}/new`}>
            <Plus />
            New Request
          </Link>
        </Button>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {config.stats.map((tile) => (
          <StatCard key={tile.label} tile={tile} />
        ))}
      </div>

      {/* Main content card */}
      <Card className="mt-6 p-4 sm:p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, type or status..."
              aria-label="Search requests"
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Filter requests">
              <SlidersHorizontal />
            </Button>
            <Button variant="outline">
              <Download />
              Export
            </Button>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            title="No requests found"
            description="Try a different search."
            action={
              <Button variant="outline" onClick={() => setQuery("")}>
                Clear search
              </Button>
            }
          />
        ) : (
          <>
            {/* Full table — lg and up */}
            <div className="mt-5 hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{config.idPrefix} ID</TableHead>
                    <TableHead>Request Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>SLA Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono text-xs font-medium">{req.id}</TableCell>
                      <TableCell>{req.type}</TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                      <TableCell>{formatDate(req.submittedOn)}</TableCell>
                      <TableCell>
                        {req.completedOn ? formatDate(req.completedOn) : "—"}
                      </TableCell>
                      <TableCell>
                        {req.slaUsedDays} / {req.slaTotalDays} days
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isClosed(req.status)}
                            onClick={() => setCancelTarget(req)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            disabled={req.status !== "Completed"}
                            onClick={emailReport}
                          >
                            Email Report
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Collapsed cards — below lg. Per design decision #5, ID / Type /
                Status / Actions stay visible; only the dates + SLA collapse. */}
            <ul className="mt-5 space-y-3 lg:hidden">
              {rows.map((req) => {
                const open = expandedId === req.id;
                return (
                  <li key={req.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <span className="truncate font-mono text-xs font-medium text-foreground">
                          {req.id}
                        </span>
                        <span className="text-sm font-medium text-foreground">{req.type}</span>
                        <StatusBadge status={req.status} />
                      </div>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-label={open ? "Hide request dates" : "Show request dates"}
                        onClick={() => setExpandedId(open ? null : req.id)}
                        className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <ChevronDown
                          className={cn("size-5 transition-transform", open && "rotate-180")}
                        />
                      </button>
                    </div>
                    {/* Actions always visible */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isClosed(req.status)}
                        onClick={() => setCancelTarget(req)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={req.status !== "Completed"}
                        onClick={emailReport}
                      >
                        Email Report
                      </Button>
                    </div>
                    {open ? (
                      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-3 text-sm">
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Submission Date
                          </dt>
                          <dd className="text-foreground">{formatDate(req.submittedOn)}</dd>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Completion Date
                          </dt>
                          <dd className="text-foreground">
                            {req.completedOn ? formatDate(req.completedOn) : "—"}
                          </dd>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            SLA Count
                          </dt>
                          <dd className="text-foreground">
                            {req.slaUsedDays} / {req.slaTotalDays} days
                          </dd>
                        </div>
                      </dl>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <PaginationBar rangeStart={1} rangeEnd={rows.length} total={rows.length} />
          </>
        )}
      </Card>

      {/* Cancel confirmation dialog */}
      {cancelTarget ? (
        <CancelRequestDialog
          request={cancelTarget}
          open={cancelTarget !== null}
          onOpenChange={(open) => {
            if (!open) setCancelTarget(null);
          }}
          onConfirm={() => setCancelTarget(null)}
        />
      ) : null}

      {/* Success toast — announced to assistive tech via role=status/aria-live */}
      {toast ? (
        <Card
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex w-[calc(100%-3rem)] max-w-sm items-start gap-3 p-4 shadow-lg"
        >
          <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">{toastTitle}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{toast}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </Card>
      ) : null}
    </div>
  );
}
