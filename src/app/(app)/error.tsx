"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Error boundary for the authenticated shell (design-review Pass 2 — error states). */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to your observability pipeline in production.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <RefreshCw className="size-7" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t load this view. Please try again — if the problem persists, contact your
          privacy team.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
