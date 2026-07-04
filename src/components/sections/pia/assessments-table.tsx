"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, Globe, ListFilter, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn, formatDate } from "@/lib/utils";
import { piaAssessments } from "@/lib/data/pia";
import type { PiaAssessment } from "@/lib/types";

function OwnerCell({ a }: { a: PiaAssessment }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-7">
        <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
          {a.ownerInitials}
        </AvatarFallback>
      </Avatar>
      <span className="whitespace-nowrap">{a.ownerName}</span>
    </div>
  );
}

export function AssessmentsTable() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return piaAssessments;
    return piaAssessments.filter((a) =>
      [a.name, a.organization, a.status].some((field) => field.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <label htmlFor="pia-search" className="sr-only">
            Search assessments
          </label>
          <Input
            id="pia-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, type or status..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Filter">
            <ListFilter className="size-4" />
          </Button>
          <Button variant="outline">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No assessments found"
          description="No PIA records match your search. Try a different ID, organization, or status."
          action={
            <Button variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <>
          {/* Full table — lg and up */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PIA Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Business Owner/Vendor</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Privacy Team</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <button
                        type="button"
                        className="whitespace-nowrap font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        {a.name}
                      </button>
                    </TableCell>
                    <TableCell>{a.organization}</TableCell>
                    <TableCell>{a.department}</TableCell>
                    <TableCell>
                      <OwnerCell a={a} />
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <Globe aria-hidden className="size-4 text-muted-foreground" />
                        {a.country}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell>{a.requestType}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.privacyTeam}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(a.createdDate)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(a.dueDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Collapsed disclosure — below lg */}
          <ul className="divide-y border-border lg:hidden">
            {rows.map((a) => {
              const isOpen = expanded === a.id;
              return (
                <li key={a.id} className="py-3">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : a.id)}
                    className="flex w-full items-center gap-3 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <span className="flex-1">
                      <span className="block font-medium text-primary">{a.name}</span>
                    </span>
                    <StatusBadge status={a.status} />
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen ? (
                    <dl className="mt-3 grid grid-cols-1 gap-3 pl-1 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          Organization
                        </dt>
                        <dd className="mt-0.5 text-foreground">{a.organization}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          Department
                        </dt>
                        <dd className="mt-0.5 text-foreground">{a.department}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          Business Owner/Vendor
                        </dt>
                        <dd className="mt-1">
                          <OwnerCell a={a} />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          Country
                        </dt>
                        <dd className="mt-0.5 flex items-center gap-1.5 text-foreground">
                          <Globe aria-hidden className="size-4 text-muted-foreground" />
                          {a.country}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          Request Type
                        </dt>
                        <dd className="mt-0.5 text-foreground">{a.requestType}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          Privacy Team
                        </dt>
                        <dd className="mt-0.5 text-muted-foreground">{a.privacyTeam}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          Created Date
                        </dt>
                        <dd className="mt-0.5 text-foreground">{formatDate(a.createdDate)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          Due Date
                        </dt>
                        <dd className="mt-0.5 text-foreground">{formatDate(a.dueDate)}</dd>
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
    </div>
  );
}
