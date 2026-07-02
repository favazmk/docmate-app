"use server";

import { sendContactEmail, sendClinicRequestEmail } from "@/lib/email";

export async function submitContact(formData: FormData) {
  const result = await sendContactEmail(formData);
  return result;
}

export async function submitClinicRequest(formData: FormData) {
  const result = await sendClinicRequestEmail(formData);
  return result;
}
