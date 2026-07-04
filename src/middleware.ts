import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/**
 * Verifies the signed session token (not just cookie presence) before
 * allowing (app) routes, redirecting to /login otherwise.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const email = token ? await verifySessionToken(token) : null;
  if (!email) {
    return NextResponse.redirect(new URL("/login", request.url));
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
