"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GA_MEASUREMENT_ID, GTM_CONTAINER_ID, isAdminPath } from "@/lib/analytics";

/**
 * Keeps the admin opt-out in sync across client-side navigation.
 *
 * The container and the initial opt-out are server-rendered in app/layout.tsx,
 * which covers the first page load. But this is a single-page app: clicking from
 * the public site into /admin never reloads the document, so the inline guard
 * that ran at load time is now stale. This re-evaluates it on every route
 * change. gtag.js re-reads `ga-disable-<ID>` on every hit, so flipping it here
 * suppresses GA4 for the rest of the admin session and restores tracking on the
 * way back out.
 *
 * Renders nothing — see lib/analytics.ts for why the tag itself is not here.
 */
export default function Analytics() {
  const pathname = usePathname();
  const inAdmin = isAdminPath(pathname);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    (window as unknown as Record<string, unknown>)[
      `ga-disable-${GA_MEASUREMENT_ID}`
    ] = inAdmin;
  }, [inAdmin]);

  // Non-GA4 tags in the container are configured in Google's UI, not here, so
  // the site cannot silence them directly. Publishing the current area to the
  // dataLayer gives whoever owns the container something to build a trigger
  // exception on.
  useEffect(() => {
    if (!GTM_CONTAINER_ID) return;
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ docmateArea: inAdmin ? "admin" : "public" });
  }, [inAdmin]);

  return null;
}
