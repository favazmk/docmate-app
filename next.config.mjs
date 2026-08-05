/** @type {import('next').NextConfig} */
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
