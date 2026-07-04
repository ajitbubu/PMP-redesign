"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (command: "config" | "event" | "js", ...args: unknown[]) => void;
  }
}

/**
 * Fires a GA4 `page_view` on every client-side route change. The initial
 * page_view is sent automatically by <GoogleAnalytics>; this covers App Router
 * navigations that don't trigger a full document load.
 */
export function AnalyticsPageView({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
      send_to: gaId,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}
