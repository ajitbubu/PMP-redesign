"use client";

import { useState } from "react";
import { Cookie } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFlags } from "@/lib/flags/provider";
import { FLAGS } from "@/lib/flags/keys";

/**
 * Example gated feature (UCM cookie consent). Mounted only when
 * `ucm.enable_cookie` is on — see the `<Flag>` wrapper in the root layout, so it
 * never flashes while flags load. The choice POSTs to a server endpoint that
 * independently re-checks the flag (and, for real privileged data, the session).
 */
export function CookieConsentBanner() {
  const { getValue, isEnabled } = useFlags();
  const [dismissed, setDismissed] = useState(false);

  // Independent kill-switch: hide the banner when explicitly disabled, even
  // though the outer `<Flag ucm.enable_cookie>` gate has already mounted us.
  const disabled = isEnabled(FLAGS.UCM_DISABLE_PRIVACY_BANNER);

  // Numeric flag read via getValue — falls back safely if absent.
  const ttlDays = getValue(FLAGS.UCM_COOKIE_TTL_DAYS, 365);

  if (disabled || dismissed) return null;

  async function respond(accepted: boolean) {
    setDismissed(true);
    try {
      await fetch("/api/ucm/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted }),
      });
    } catch {
      // Non-blocking: the UI is dismissed regardless; the server is source of truth.
    }
  }

  return (
    <Card
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-2xl flex-col gap-4 p-5 shadow-lg sm:flex-row sm:items-center"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Cookie className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">We value your privacy</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          We use essential cookies to run this portal and optional cookies to improve it. Your
          choice is remembered for {ttlDays} days.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" onClick={() => respond(false)}>
          Reject non-essential
        </Button>
        <Button onClick={() => respond(true)}>Accept all</Button>
      </div>
    </Card>
  );
}
