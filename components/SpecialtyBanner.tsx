/**
 * Promo banner shown at the top of /search for specific specialty landing URLs.
 *
 * This exists for paid traffic: a Google Ads campaign points at
 * /search?specialty=Family+Medicine and the ad creative needs a matching visual
 * above the results. Nothing renders on any other search URL — an unlisted
 * specialty, or no specialty at all, returns null and the page looks exactly
 * as it did before.
 *
 * To add another campaign landing banner, export the artwork as WebP into
 * public/banners/ at two widths per breakpoint (1x and 2x) and add one entry
 * below. The key is the `specialty` query value, lowercased.
 */
type BannerConfig = {
  /** Wide artwork shown from the md breakpoint up: [1x, 2x] WebP paths. */
  desktop: [string, string];
  /** Taller crop for phones: [1x, 2x] WebP paths. Falls back to `desktop`. */
  mobile?: [string, string];
  /** Alt text — this is a real content image, not decoration. */
  alt: string;
  /** Optional click-through. Omit to render the banner as a plain image. */
  href?: string;
  /**
   * Aspect boxes reserving space so the banner cannot shift the page. Both
   * breakpoints live in one string because Tailwind scans source text: a
   * `md:` prefix built at runtime would never be compiled into the CSS.
   * Keep these matched to the artwork's real pixel ratio.
   */
  aspectClass?: string;
};

const BANNERS: Record<string, BannerConfig> = {
  "family medicine": {
    desktop: [
      "/banners/family-medicine-desktop-1280.webp",
      "/banners/family-medicine-desktop-2560.webp",
    ],
    mobile: [
      "/banners/family-medicine-mobile-480.webp",
      "/banners/family-medicine-mobile-960.webp",
    ],
    alt: "Back to school: get the flu vaccine before school starts. Book a family medicine doctor in Dubai with DocMate",
    aspectClass: "aspect-[960/644] md:aspect-[2560/1086]",
    // href: "/search?specialty=Family+Medicine&city=Dubai",
  },
};

/** Density descriptors rather than `w` + `sizes`: the banner's rendered width
 *  is fixed by the page container, so the only real variable is screen DPR. */
const densitySrcSet = ([x1, x2]: [string, string]) => `${x1} 1x, ${x2} 2x`;

export default function SpecialtyBanner({ specialty }: { specialty?: string }) {
  const banner = specialty ? BANNERS[specialty.trim().toLowerCase()] : undefined;

  if (!banner) return null;

  const {
    desktop,
    mobile = desktop,
    alt,
    href,
    aspectClass = "aspect-[960/644] md:aspect-[2560/1086]",
  } = banner;

  // A <picture> with a media query rather than two next/image blocks: the
  // hidden-by-CSS approach still downloaded both crops on every device, which
  // wasted roughly 150KB per mobile visitor on a page we pay per click for.
  // The artwork is already exported as sized, compressed WebP, so the image
  // optimizer has nothing left to add — the browser fetches exactly one file.
  const image = (
    <div className={`relative w-full ${aspectClass}`}>
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet={densitySrcSet(desktop)}
          type="image/webp"
        />
        <img
          src={mobile[0]}
          srcSet={densitySrcSet(mobile)}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
    </div>
  );

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-gray-border bg-white">
      {href ? (
        <a href={href} className="block">
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  );
}
