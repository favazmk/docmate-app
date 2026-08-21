import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import {
  EMIRATES,
  LANDING_SPECIALTIES,
  SITE_URL,
} from "@/lib/constants";

// Regenerated hourly. New doctors and hospitals are worth surfacing quickly, but
// not at the cost of two table scans on every crawler hit.
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

/** Pages that exist regardless of what is in the database. */
const STATIC_PATHS: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/search", priority: 0.9, changeFrequency: "daily" },
  { path: "/hospitals", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/list-your-clinic", priority: 0.5, changeFrequency: "monthly" },
  { path: "/track", priority: 0.3, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Emirate landing pages and their promoted specialties. Both are static
  // templates, so they are listed without touching the database.
  for (const slug of Object.keys(EMIRATES)) {
    entries.push({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    for (const specialty of LANDING_SPECIALTIES) {
      entries.push({
        url: `${SITE_URL}/${slug}/${specialty.toLowerCase()}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // A sitemap that 500s is worse than a short one — Google treats the fetch as a
  // hard error and keeps the previous copy. If the database is unreachable,
  // serve the static half rather than failing the whole document.
  try {
    const [doctors, hospitals] = await Promise.all([
      prisma.doctor.findMany({
        where: { status: "Active" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.hospitalGroup.findMany({
        select: { id: true, updatedAt: true },
      }),
    ]);

    for (const doctor of doctors) {
      entries.push({
        url: `${SITE_URL}/doctors/${doctor.slug}`,
        lastModified: doctor.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }

    for (const hospital of hospitals) {
      entries.push({
        url: `${SITE_URL}/hospitals/${hospital.id}`,
        lastModified: hospital.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("[sitemap] database unreachable, serving static entries", error);
  }

  return entries;
}
