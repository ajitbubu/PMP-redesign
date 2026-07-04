"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { consentGroups } from "@/lib/data/consents";

export function ConsentGroupsList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return consentGroups;
    return consentGroups.filter((group) => group.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <Card className="p-4">
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search groups..."
          aria-label="Search groups"
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No groups found" description="Try a different search." />
      ) : (
        <ul>
          {filtered.map((group) => (
            <li key={group.slug}>
              <Link
                href={`/consent/${group.slug}`}
                className="mb-3 flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/40"
              >
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{group.name}</span>
                    {group.isNew ? <Badge variant="new">New</Badge> : null}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {group.count} Consent(s)
                  </span>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
