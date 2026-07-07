import { NextResponse } from "next/server";
import { loadFlags } from "@/lib/flags/load-flags.server";

/**
 * Same-origin flags endpoint the client provider polls. Proxies the validated,
 * fail-closed snapshot from `loadFlags()` (which handles the CDN fetch + caching
 * server-side) so the browser never needs the CDN origin or its details.
 *
 * Supports conditional requests: the client sends `If-None-Match` with its last
 * ETag and gets a 304 when nothing changed.
 */
export const dynamic = "force-dynamic";

const CACHE_CONTROL = "public, max-age=30, must-revalidate";

export async function GET(request: Request) {
  const snapshot = await loadFlags(); // never throws — fails closed to empty
  const etag = snapshot.etag ?? '"flags-empty"';

  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: etag, "Cache-Control": CACHE_CONTROL },
    });
  }

  return NextResponse.json(
    { features: snapshot.features, meta: snapshot.meta, etag },
    { headers: { ETag: etag, "Cache-Control": CACHE_CONTROL } },
  );
}
