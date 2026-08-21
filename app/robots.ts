import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * Serves /robots.txt.
 *
 * Until this existed the path fell through to /[emirate] and rendered a doctor
 * landing page titled "Find Top Doctors in Robots.txt", so crawlers got HTML
 * where they expected directives. Next resolves static routes ahead of dynamic
 * segments, so this file wins; the whitelist in EMIRATES is the second line of
 * defence.
 *
 * Disallowed paths are the ones with nothing to index: staff and patient areas
 * behind auth, the API, and the post-booking confirmation screen. Admin is
 * already redirected by middleware.ts and excluded from analytics — this just
 * states it where crawlers look.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/api/",
          "/login",
          "/register",
          "/booking-confirmed",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
