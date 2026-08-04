import { revalidatePath } from "next/cache";

/**
 * Public pages are served from cache (see `export const revalidate` at the top
 * of each one). Call this after any admin mutation so the change is visible on
 * the site immediately instead of waiting for the cache window to expire.
 *
 * Dynamic routes need the literal route pattern plus "page", which busts every
 * generated instance of that route rather than a single URL.
 */
export function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/hospitals");
  revalidatePath("/hospitals/[id]", "page");
  revalidatePath("/doctors/[slug]", "page");
  revalidatePath("/book/[slug]", "page");
  revalidatePath("/[emirate]/[specialty]", "page");
}
