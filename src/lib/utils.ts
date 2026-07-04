import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date-ish string for display, tolerating already-formatted values. */
export function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Mask a value, keeping the last `visible` characters. */
export function maskValue(value: string, visible = 4): string {
  if (value.length <= visible) return value;
  const masked = "•".repeat(Math.max(0, value.length - visible));
  return masked + value.slice(-visible);
}
