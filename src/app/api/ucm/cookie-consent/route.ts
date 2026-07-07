import { NextResponse } from "next/server";
import { getServerFlags } from "@/lib/flags/server";
import { FLAGS } from "@/lib/flags/keys";

/**
 * Server-side enforcement for the cookie-consent feature. The client `<Flag>`
 * only hides the UI — this endpoint is the actual boundary, so it re-checks the
 * flag server-side and fails closed (404) when the feature is off.
 *
 * For an endpoint that returned privileged data or performed a privileged
 * action, you would ALSO verify the session/authorization here (e.g. via
 * `verifySessionToken` from `@/lib/auth/session`) — a flag being on never
 * implies the caller is allowed. This demo stores a non-sensitive preference,
 * so a flag check is sufficient.
 */
export async function POST(request: Request) {
  const flags = await getServerFlags();
  if (!flags.isEnabled(FLAGS.UCM_ENABLE_COOKIE)) {
    return NextResponse.json({ error: "feature_disabled" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const accepted = typeof body?.accepted === "boolean" ? body.accepted : null;
  if (accepted === null) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const ttlDays = flags.getValue(FLAGS.UCM_COOKIE_TTL_DAYS, 365);
  // Persist `accepted` against the session here in a real implementation.
  return NextResponse.json({ ok: true, accepted, ttlDays });
}
