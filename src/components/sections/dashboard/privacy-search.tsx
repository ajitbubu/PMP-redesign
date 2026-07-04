"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchSuggestions } from "@/lib/data/dashboard";

export function PrivacySearch() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-4 size-5 text-muted-foreground" />
        <label htmlFor="privacy-search" className="sr-only">
          Search your privacy rights
        </label>
        <Input
          id="privacy-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Start typing here or pick from one of our suggestions..."
          className="h-14 rounded-full border-transparent bg-card pl-12 pr-16 text-base shadow-sm"
        />
        <Button
          type="button"
          size="icon"
          aria-label="Search"
          className="absolute right-2 size-11 rounded-full bg-primary"
        >
          <ArrowRight className="size-5" />
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {searchSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setQuery(suggestion)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
