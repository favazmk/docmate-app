"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Google Tag Manager.
 *
 * GA4 is configured as a tag *inside* the GTM container, confirmed with the
 * marketer on 2026-08-19 — so this file must NOT also load gtag.js directly.
 * Doing both would count every pageview twice, once per route. GTM is the only
 * tag loaded here; GA4 arrives through it.
 *
 * GA_MEASUREMENT_ID is therefore not used to load anything. It names the
 * property for the `ga-disable-<ID>` kill switch below, which is the one lever
 * the site still has over a GA4 tag that GTM injects.
 *
 * Neither ID is a secret — both ship in the page source of every tracked site,
 * which is how Google's tags find the right container and property. They are
 * hardcoded as defaults so a deploy tracks without anyone remembering to set an
 * env var, and left overridable so staging can point elsewhere (or at "" to
 * switch off).
 */
const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-N57SPSKS";
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-4YZ5R1EMWF";

/** The admin dashboard is staff-only; its traffic would skew the visitor reports. */
function isAdminPath(pathname: string | null): boolean {
  return pathname === "/admin" || (pathname?.startsWith("/admin/") ?? false);
}

export default function Analytics() {
  const pathname = usePathname();
  const inAdmin = isAdminPath(pathname);

  // Landing directly on /admin skips GTM entirely (see the early return). But an
  // admin who browses the public site first and *then* clicks through to the
  // dashboard already has the container loaded, and unmounting a <Script> does
  // not unload it. `ga-disable-<ID>` is Google's official opt-out flag, and
  // gtag.js re-reads it on every hit — so this suppresses the GA4 tag GTM
  // injected, even though this file never loaded gtag.js itself.
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

  if (inAdmin || !GTM_CONTAINER_ID) return null;

  return (
    <>
      {/*
        afterInteractive: the container loads once the page is usable, so
        tracking never delays first paint for a patient finding a doctor.
      */}
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
      </Script>

      {/* Fallback for visitors with JavaScript disabled. */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
