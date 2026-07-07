import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { loadFlags } from "@/lib/flags/load-flags.server";
import { isEnabled } from "@/lib/flags/core";
import { FLAGS } from "@/lib/flags/keys";

/**
 * Route prefixes gated by a feature flag. Enforced at the edge (before render)
 * so a disabled feature is truly unreachable and returns a proper redirect
 * status — the nav hiding is UX, this is the boundary. Dashboard is absent on
 * purpose: it's the always-on landing we redirect to.
 */
const GATED_ROUTES: ReadonlyArray<{ prefix: string; flag: string }> = [
  { prefix: "/consent", flag: FLAGS.UCM_ENABLE_CONSENT },
  { prefix: "/preferences", flag: FLAGS.UCM_ENABLE_PREFERENCE },
  { prefix: "/rights", flag: FLAGS.DSAR_ENABLE_DSAR },
  { prefix: "/pia", flag: FLAGS.PIA_ENABLE_PIA },
  { prefix: "/profile", flag: FLAGS.PROFILE_ENABLE_PROFILE },
];

/**
 * Verifies the signed session token (not just cookie presence) before allowing
 * (app) routes, redirecting to /login otherwise, then enforces feature flags on
 * gated routes (fail closed: a disabled/unknown flag redirects to /dashboard).
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const email = token ? await verifySessionToken(token) : null;
  if (!email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const path = request.nextUrl.pathname;
  const gate = GATED_ROUTES.find(
    (g) => path === g.prefix || path.startsWith(g.prefix + "/"),
  );
  if (gate) {
    const { features } = await loadFlags();
    if (!isEnabled(features, gate.flag)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/consent/:path*",
    "/preferences/:path*",
    "/rights/:path*",
    "/pia/:path*",
    "/profile/:path*",
  ],
};
