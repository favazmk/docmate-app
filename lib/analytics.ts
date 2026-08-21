/**
 * Google Tag Manager / GA4 wiring.
 *
 * GA4 is configured as a tag *inside* the GTM container, confirmed with the
 * marketer on 2026-08-19 — so nothing here may load gtag.js directly. Doing both
 * would count every pageview twice, once per route. GTM is the only tag loaded;
 * GA4 arrives through it.
 *
 * These are snippet *strings* the root layout server-renders, rather than
 * next/script components, and that is the whole point. The previous setup used
 * next/script with strategy="afterInteractive", which injects the loader from
 * JavaScript after hydration and so leaves no trace of the tag in the HTML the
 * server sends. GA4's Tag coverage report reads that HTML: on 2026-08-21 it
 * listed 10 of 52 pages as "Not tagged" even though all of them tracked real
 * visitors correctly. Rendering the snippet server-side makes the tag
 * detectable without depending on a crawler's JS render finishing.
 *
 * Neither ID is a secret — both ship in the page source of every tracked site,
 * which is how Google's tags find the right container and property. They are
 * hardcoded as defaults so a deploy tracks without anyone remembering to set an
 * env var, and left overridable so staging can point elsewhere (or at "" to
 * switch off).
 */
export const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-N57SPSKS";
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-4YZ5R1EMWF";

/** The admin dashboard is staff-only; its traffic would skew the visitor reports. */
export function isAdminPath(pathname: string | null | undefined): boolean {
  return pathname === "/admin" || (pathname?.startsWith("/admin/") ?? false);
}

/**
 * Runs synchronously *before* the loader below, so the admin opt-out is already
 * in place by the time GTM fires its first hit — the container now ships on
 * every page, admin included, and React has not hydrated this early.
 *
 * `ga-disable-<ID>` is Google's official opt-out flag and gtag.js re-reads it on
 * every hit, so this suppresses the GA4 tag GTM injects without this file ever
 * touching gtag.js. Non-GA4 tags in the container are configured in Google's UI
 * and cannot be silenced from here, so the area is also published to the
 * dataLayer for whoever owns the container to build a trigger exception on.
 */
export const GTM_GUARD_SNIPPET = `(function(){var p=window.location.pathname,a=p==='/admin'||p.indexOf('/admin/')===0;window['ga-disable-${GA_MEASUREMENT_ID}']=a;window.dataLayer=window.dataLayer||[];window.dataLayer.push({docmateArea:a?'admin':'public'});})();`;

/** Google's stock container loader. `j.async` keeps it off the critical path. */
export const GTM_LOADER_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`;
