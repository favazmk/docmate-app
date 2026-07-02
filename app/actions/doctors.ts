"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createDoctor(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const specialty = formData.get("specialty") as string;
    const city = formData.get("city") as string;
    const fee = parseInt(formData.get("fee") as string);
    const languages = formData.get("languages") as string;
    const affiliation = formData.get("affiliation") as string;
    const bio = formData.get("bio") as string;
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

    const doctor = await prisma.doctor.create({
      data: {
        name,
        slug,
        email,
        specialty,
        city,
        fee,
        languages: languages || "English",
        affiliation: affiliation || "Independent",
        bio: bio || "A dedicated healthcare professional.",
        photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        status: "Active"
      }
    });

    revalidatePath("/admin/doctors");
    revalidatePath("/search");
    
    return { success: true, doctor };
  } catch (error) {
    console.error("Error creating doctor:", error);
    return { success: false, error: "Failed to create doctor" };
  }
}

export async function updateDoctor(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const specialty = formData.get("specialty") as string;
    const city = formData.get("city") as string;
    const fee = parseInt(formData.get("fee") as string);
    const languages = formData.get("languages") as string;
    const affiliation = formData.get("affiliation") as string;
    const bio = formData.get("bio") as string;

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        email,
        specialty,
        city,
        fee,
        languages: languages || "English",
        affiliation: affiliation || "Independent",
        bio: bio || "A dedicated healthcare professional.",
      }
    });

    revalidatePath("/admin/doctors");
    revalidatePath("/search");
    
    return { success: true, doctor };
  } catch (error) {
    console.error("Error updating doctor:", error);
    return { success: false, error: "Failed to update doctor" };
  }
}

export async function deleteDoctor(id: string) {
  try {
    await prisma.doctor.delete({
      where: { id }
    });

    revalidatePath("/admin/doctors");
    revalidatePath("/search");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return { success: false, error: "Failed to delete doctor" };
  }
}
