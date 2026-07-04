"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/shared/empty-state";
import { preferenceChannels } from "@/lib/data/preferences";

/** Searchable list of preference channels; each row links to its detail page. */
export function PreferenceList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return preferenceChannels;
    return preferenceChannels.filter((channel) =>
      channel.name.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Card className="p-5">
      <div className="mb-4">
        <Label htmlFor="preference-filter" className="sr-only">
          Filter groups
        </Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="preference-filter"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter groups..."
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <ul className="divide-y divide-border">
          {filtered.map((channel) => (
            <li key={channel.slug}>
              <Link
                href={`/preferences/${channel.slug}`}
                className="flex items-center justify-between gap-4 rounded-md px-2 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {channel.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {channel.count} Consent(s)
                  </p>
                </div>
                <ChevronRight
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No Groups Found"
          description={`No preference groups match "${query}". Try a different search term.`}
        />
      )}
    </Card>
  );
}
