"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { consentGroups } from "@/lib/data/consents";
import { cn } from "@/lib/utils";

/**
 * Left "Consents" master panel of the consent workspace. Lists every consent
 * group, filterable by name; the group matching `selectedSlug` is highlighted
 * and each row links to its detail route.
 */
export function ConsentGroupsList({ selectedSlug }: { selectedSlug?: string }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return consentGroups;
    return consentGroups.filter((group) => group.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <Card className="p-4">
      <h2 className="mb-3 font-display text-lg font-bold text-foreground">Consents</h2>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter groups..."
          aria-label="Search groups"
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No groups found" description="Try a different search." />
      ) : (
        <ul className="space-y-1.5">
          {filtered.map((group) => {
            const selected = group.slug === selectedSlug;
            return (
              <li key={group.slug}>
                <Link
                  href={`/consent/${group.slug}`}
                  aria-current={selected ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary/60",
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold">{group.name}</span>
                      {group.isNew ? (
                        <Badge
                          variant="new"
                          className={cn(
                            selected && "bg-primary-foreground/20 text-primary-foreground",
                          )}
                        >
                          New
                        </Badge>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        selected ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      {group.count} Consent(s)
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
