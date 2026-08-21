import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { EMIRATES, LANDING_SPECIALTIES, isEmirateSlug } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { emirate: string } }): Promise<Metadata> {
  const emirateFormatted = EMIRATES[params.emirate.toLowerCase()];

  if (!emirateFormatted) {
    return { title: "Page not found" };
  }

  return {
    title: `Find the Best Doctors in ${emirateFormatted} | Book Online`,
    description: `Find and book verified doctors, dentists, and specialists across ${emirateFormatted}. View profiles, check insurance, and book appointments instantly.`,
    alternates: { canonical: `/${params.emirate.toLowerCase()}` },
  };
}

export default function EmirateLandingPage({ params }: { params: { emirate: string } }) {
  // This route matches *any* single path segment at the site root, so without
  // this check every unknown URL — /robots.txt, /sitemap.xml, /doctors, typos —
  // rendered a plausible-looking landing page for a city that does not exist.
  if (!isEmirateSlug(params.emirate)) {
    notFound();
  }

  const emirateSlug = params.emirate.toLowerCase();
  const emirateFormatted = EMIRATES[emirateSlug];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm font-medium text-text-light mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-dark">{emirateFormatted}</span>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
            Find Top Doctors in {emirateFormatted}
          </h1>
          <p className="text-lg text-text-mid leading-relaxed">
            Select a specialty to find the best healthcare providers near you. Book appointments instantly with top-rated specialists.
          </p>
        </div>

        <div className="bg-white border border-gray-border rounded-3xl p-8 md:p-12 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-text-dark mb-8">Popular Specialties in {emirateFormatted}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {LANDING_SPECIALTIES.map((specialty) => (
              <Link key={specialty} href={`/${emirateSlug}/${specialty.toLowerCase()}`} className="border border-gray-border hover:border-blue-primary hover:text-blue-primary text-text-dark font-medium px-6 py-3 rounded-xl transition-colors">
                {specialty}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
