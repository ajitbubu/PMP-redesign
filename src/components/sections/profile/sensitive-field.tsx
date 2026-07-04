"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { maskValue } from "@/lib/utils";

export function SensitiveField({
  label,
  value,
  required,
}: {
  label: string;
  value: string;
  required?: boolean;
}) {
  const [shown, setShown] = React.useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label>
          {label}
          {required ? (
            <span className="text-destructive">
              *<span className="sr-only"> (required)</span>
            </span>
          ) : null}
        </Label>
        <button
          type="button"
          onClick={() => setShown((prev) => !prev)}
          aria-label={`${shown ? "Hide" : "Show"} ${label}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {shown ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {shown ? "Hide" : "Show"}
        </button>
      </div>
      <div className="flex h-11 items-center rounded-md border border-input bg-secondary/60 px-3.5 text-foreground">
        {shown ? (
          <span className="truncate">{value}</span>
        ) : (
          <>
            <span className="truncate" aria-hidden="true">
              {maskValue(value)}
            </span>
            <span className="sr-only">{label} hidden</span>
          </>
        )}
      </div>
    </div>
  );
}
