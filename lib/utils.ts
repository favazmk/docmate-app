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
// ("15+"), a number with a unit ("12 years", "6 yrs"), or their own wording
// ("Over a decade"). Normalise the numeric shapes to one house style —
// "12 Years Experience" — so a grid of cards does not mix "12 years Experience"
// with "15 Years Experience" depending on what each admin happened to type.
export function formatExperience(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;

  // "15", "15+", "12 years", "6 yrs", "1 year" -> "<n><+> Year(s) Experience"
  const numeric = value.match(/^(\d+)(\+?)\s*(?:years?|yrs?)?\.?$/i);
  if (numeric) {
    const [, count, plus] = numeric;
    // "1 year", but "1+ years" — a plus means "more than", so it stays plural.
    const unit = count === "1" && !plus ? "Year" : "Years";
    return `${count}${plus} ${unit} Experience`;
  }

  // Already says "experience" ("20 Years Experience", "Experienced since 2005")
  if (/experience/i.test(value)) return value;

  // Anything else with a number in it gets the suffix; prose the admin wrote
  // themselves ("Over a decade") is left alone rather than being made to read
  // "Over a decade Experience".
  return /\d/.test(value) ? `${value} Experience` : value;
}
