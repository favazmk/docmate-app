/** @type {import('next').NextConfig} */

// Canonical public origin, mirrored from lib/constants.ts. next.config runs
// outside the TS path aliases, so the default is repeated rather than imported.
const CANONICAL_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://docmate.ae'
).replace(/\/$/, '');

const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kingscollegehospitaldubai.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    const apexHost = new URL(CANONICAL_ORIGIN).host;

    return [
      // www.docmate.ae served a full 200 alongside the apex domain, so every
      // page existed at two URLs with no canonical tag to break the tie. Google
      // indexed both and split the ranking signals — GA4's Tag coverage listed
      // the www and non-www copies of the same doctor page as separate rows.
      // A 301 collapses them onto the canonical host.
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${apexHost}` }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      },
      // /doctors is not a listing page — only /doctors/[slug] exists — so it fell
      // through to the /[emirate] wildcard and rendered "Find Top Doctors in
      // Doctors". That wildcard is whitelisted now, so send the URL to the real
      // listing rather than letting a page Google already knows start 404ing.
      {
        source: '/doctors',
        destination: '/search',
        permanent: true,
      },
    ];
  },

  // Next.js stamps fully static pages with `s-maxage=31536000` on the assumption
  // that the CDN is purged on every deploy. Hostinger's CDN is not, so it held
  // /login's HTML for a year while each build renamed the hashed JS chunks that
  // HTML points at — the chunks 404'd, nothing hydrated, and the page sat on its
  // "Loading..." fallback forever.
  //
  // Documents must therefore always be revalidated. Everything under
  // /_next/static is content-hashed and immutable, so it is excluded here and
  // keeps its one-year cache. Next emits ETags for pages, so revalidation is a
  // cheap 304 rather than a full re-download.
  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
