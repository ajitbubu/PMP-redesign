import { cn } from "@/lib/utils";

/** The DataSafeguard shield-check mark used in the sidebar and auth chrome. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="DataSafeguard"
      className={cn("size-9", className)}
    >
      <path
        d="M20 3 6 8v9c0 8.7 5.7 16.9 14 19 8.3-2.1 14-10.3 14-19V8L20 3Z"
        className="fill-navy-700 stroke-brand-500"
        strokeWidth={1.5}
      />
      <path
        d="m14 20 4.2 4.2L27 15"
        fill="none"
        className="stroke-brand-400"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
