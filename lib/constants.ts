export const DOCMATE_PHONE = "+971 4 123 4567";
export const DOCMATE_EMAIL = "appointments@docmate.ae";

// Homepage "Featured" sections cap out at 4 slots each.
export const MAX_FEATURED_DOCTORS = 4;
export const MAX_FEATURED_HOSPITALS = 4;

/**
 * Icons an admin can pick for a Specialty. Values are lucide-react export names —
 * they are resolved dynamically (`(Icons as any)[iconName]`), so every entry here
 * must be a real export of the installed lucide-react version.
 * Grouped by theme so the picker stays scannable as the list grows.
 */
export const SPECIALTY_ICONS: { value: string; label: string; group: string }[] = [
  // General / clinical
  { value: "Activity", label: "Activity (default)", group: "General" },
  { value: "Stethoscope", label: "Stethoscope", group: "General" },
  { value: "BriefcaseMedical", label: "Medical Bag", group: "General" },
  { value: "ClipboardPlus", label: "Medical Chart", group: "General" },
  { value: "Cross", label: "Medical Cross", group: "General" },
  { value: "Hospital", label: "Hospital", group: "General" },
  { value: "Ambulance", label: "Emergency / Ambulance", group: "General" },
  { value: "Bed", label: "Inpatient / Ward", group: "General" },
  { value: "ShieldPlus", label: "Preventive Care", group: "General" },
  { value: "Gauge", label: "Screening / Diagnostics", group: "General" },

  // Body systems
  { value: "Heart", label: "Heart", group: "Body Systems" },
  { value: "HeartPulse", label: "Cardiology / Pulse", group: "Body Systems" },
  { value: "ScanHeart", label: "Cardiac Imaging", group: "Body Systems" },
  { value: "Brain", label: "Brain / Neurology", group: "Body Systems" },
  { value: "BrainCircuit", label: "Neuroscience", group: "Body Systems" },
  { value: "Eye", label: "Eye / Ophthalmology", group: "Body Systems" },
  { value: "Ear", label: "Ear / ENT", group: "Body Systems" },
  { value: "Bone", label: "Bone / Orthopedics", group: "Body Systems" },
  { value: "Skull", label: "Skull / Maxillofacial", group: "Body Systems" },
  { value: "Smile", label: "Dental / Smile", group: "Body Systems" },
  { value: "SmilePlus", label: "Cosmetic Dentistry", group: "Body Systems" },
  { value: "Wind", label: "Respiratory / Pulmonology", group: "Body Systems" },
  { value: "Droplet", label: "Blood / Hematology", group: "Body Systems" },
  { value: "Droplets", label: "Urology / Nephrology", group: "Body Systems" },
  { value: "Hand", label: "Hand Surgery", group: "Body Systems" },
  { value: "Footprints", label: "Podiatry / Foot", group: "Body Systems" },
  { value: "Fingerprint", label: "Dermatology / Skin", group: "Body Systems" },
  { value: "Speech", label: "Speech Therapy", group: "Body Systems" },

  // Patients & people
  { value: "Baby", label: "Baby / Pediatrics", group: "Patients" },
  { value: "User", label: "Adult Patient", group: "Patients" },
  { value: "UserRound", label: "Patient (rounded)", group: "Patients" },
  { value: "Users", label: "Family Medicine", group: "Patients" },
  { value: "PersonStanding", label: "Physiotherapy", group: "Patients" },
  { value: "Accessibility", label: "Rehabilitation", group: "Patients" },
  { value: "HeartHandshake", label: "Counselling / Support", group: "Patients" },
  { value: "MessageCircleHeart", label: "Mental Health", group: "Patients" },
  { value: "Handshake", label: "Consultation", group: "Patients" },

  // Procedures & lab
  { value: "Syringe", label: "Injection / Vaccination", group: "Procedures & Lab" },
  { value: "Pill", label: "Pharmacy / Medication", group: "Procedures & Lab" },
  { value: "Scissors", label: "Surgery", group: "Procedures & Lab" },
  { value: "Bandage", label: "Wound Care", group: "Procedures & Lab" },
  { value: "Thermometer", label: "Fever / Vitals", group: "Procedures & Lab" },
  { value: "Microscope", label: "Pathology / Lab", group: "Procedures & Lab" },
  { value: "TestTube", label: "Test Tube", group: "Procedures & Lab" },
  { value: "TestTubes", label: "Lab Panel", group: "Procedures & Lab" },
  { value: "FlaskConical", label: "Research / Biochemistry", group: "Procedures & Lab" },
  { value: "Dna", label: "Genetics / DNA", group: "Procedures & Lab" },
  { value: "Atom", label: "Nuclear Medicine", group: "Procedures & Lab" },
  { value: "Radiation", label: "Radiology / Oncology", group: "Procedures & Lab" },
  { value: "Scan", label: "Imaging / Scan", group: "Procedures & Lab" },
  { value: "Bug", label: "Infectious Disease", group: "Procedures & Lab" },

  // Lifestyle & wellness
  { value: "Sparkles", label: "Aesthetics / Cosmetic", group: "Lifestyle & Wellness" },
  { value: "Dumbbell", label: "Sports Medicine", group: "Lifestyle & Wellness" },
  { value: "Salad", label: "Nutrition / Dietetics", group: "Lifestyle & Wellness" },
  { value: "Apple", label: "Healthy Eating", group: "Lifestyle & Wellness" },
  { value: "Weight", label: "Weight Management", group: "Lifestyle & Wellness" },
  { value: "Moon", label: "Sleep Medicine", group: "Lifestyle & Wellness" },
  { value: "Leaf", label: "Holistic / Ayurveda", group: "Lifestyle & Wellness" },
  { value: "Flower", label: "Wellness / Spa", group: "Lifestyle & Wellness" },
  { value: "Waves", label: "Hydrotherapy", group: "Lifestyle & Wellness" },
  { value: "Ribbon", label: "Awareness / Oncology", group: "Lifestyle & Wellness" },
  { value: "Zap", label: "Urgent / Fast Care", group: "Lifestyle & Wellness" },
  { value: "Shield", label: "Immunology", group: "Lifestyle & Wellness" },
];

/** Flat list of just the icon names — handy for validation. */
export const SPECIALTY_ICON_NAMES = SPECIALTY_ICONS.map((i) => i.value);

/**
 * Canonical public origin. Used for canonical URLs, robots.txt and sitemap.xml,
 * which all need absolute URLs. Overridable so staging generates its own.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://docmate.ae"
).replace(/\/$/, "");

/**
 * Emirates that have a /[emirate] landing page, slug -> display name.
 *
 * This list is a whitelist, not decoration. /[emirate] sits at the site root and
 * matches any single segment, so before it was checked against this list every
 * URL on the domain rendered a landing page — /robots.txt and /sitemap.xml
 * included, which is why neither file existed and Google had no crawl guidance.
 * Anything not listed here now 404s.
 *
 * Keep in step with the cities offered in ClinicsClient, SearchBar and
 * FilterSidebar — a landing page for a city with no clinics is an empty page.
 */
export const EMIRATES: Record<string, string> = {
  dubai: "Dubai",
  sharjah: "Sharjah",
  ajman: "Ajman",
};

export function isEmirateSlug(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(EMIRATES, slug.toLowerCase());
}

/** Specialties promoted on the emirate landing pages and listed in the sitemap. */
export const LANDING_SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Gynecology",
  "Neurology",
  "Orthopedics",
] as const;

/**
 * URL form of a specialty name: "Internal Medicine" -> "internal-medicine".
 * Doctor.specialty is free text, so this has to tolerate spacing and casing
 * that no dropdown enforced.
 */
export function slugifySpecialty(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
