import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeSearchText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents/diacritics
    .replace(/['’\-\.]/g, "") // Remove apostrophes, hyphens, and periods
    .toLowerCase()
    .trim();
}

// Admins type experience free-form: a bare number ("15"), a number with a plus
// ("15+"), or their own wording ("15 years", "Over a decade"). Normalise every
// shape to read as "… Experience" so the cards and the profile page agree.
export function formatExperience(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;

  // "15" / "15+" -> "15+ Years Experience"
  if (/^\d+\+?$/.test(value)) return `${value} Years Experience`;

  // Already says "experience" somewhere ("15 Years Experience", "Experienced since 2005")
  if (/experience/i.test(value)) return value;

  // "15 years" / "15+ yrs" -> "15 years Experience". Prose the admin wrote
  // themselves ("Over a decade") is left alone rather than made to read
  // "Over a decade Experience".
  return /\d/.test(value) ? `${value} Experience` : value;
}
