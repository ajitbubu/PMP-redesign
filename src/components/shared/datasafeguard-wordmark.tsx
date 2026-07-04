import { cn } from "@/lib/utils";

/** The "datasafeguard" wordmark — blue "data" + dark "safeguard" + shield tick. */
export function DataSafeguardWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-display", className)}>
      <span className="font-bold lowercase tracking-tight">
        <span className="text-primary">data</span>
        <span className="text-navy-800">safeguard</span>
      </span>
      <svg viewBox="0 0 24 24" aria-hidden className="size-[1em]">
        <path
          d="M12 2 4 5v6c0 5 3.4 9.6 8 11 4.6-1.4 8-6 8-11V5l-8-3Z"
          className="fill-none stroke-primary"
          strokeWidth={1.6}
        />
        <path
          d="m8.5 12 2.5 2.5L16 9"
          className="fill-none stroke-primary"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** "Powered by DataSafeguard" credit — the resolved brand-hierarchy treatment. */
export function PoweredByDataSafeguard({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-muted-foreground", className)}>
      <span className="text-xs font-medium">Powered by</span>
      <DataSafeguardWordmark className="text-sm" />
    </span>
  );
}
