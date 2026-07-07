"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createDoctor(formData: FormData) {
  try {
    await requireAdmin();
    const name = formData.get("name") as string;
    const clinicEmail = formData.get("clinicEmail") as string;
    const clinicPhone = formData.get("clinicPhone") as string;
    const specialty = formData.get("specialty") as string;
    const city = formData.get("city") as string;
    const fee = 0;
    const languages = formData.get("languages") as string;
    const affiliation = formData.get("affiliation") as string;
    const bio = formData.get("bio") as string;
    const qualifications = formData.get("qualifications") as string;
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    const email = `dr.${slug}@kingscollegehospital.ae`;

    const doctor = await prisma.doctor.create({
      data: {
        name,
        slug,
        email,
        clinicEmail: clinicEmail || "info@kingscollegehospital.ae",
        clinicPhone: clinicPhone || "+971 800 7777",
        specialty,
        city,
        fee,
        languages: languages || "English",
        affiliation: affiliation || "Independent",
        bio: bio || "A dedicated healthcare professional.",
        qualifications: qualifications || "MD, Board Certified Specialist",
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
    await requireAdmin();
    const name = formData.get("name") as string;
    const clinicEmail = formData.get("clinicEmail") as string;
    const clinicPhone = formData.get("clinicPhone") as string;
    const specialty = formData.get("specialty") as string;
    const city = formData.get("city") as string;
    const fee = 0;
    const languages = formData.get("languages") as string;
    const affiliation = formData.get("affiliation") as string;
    const bio = formData.get("bio") as string;
    const qualifications = formData.get("qualifications") as string;

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        clinicEmail: clinicEmail || "info@kingscollegehospital.ae",
        clinicPhone: clinicPhone || "+971 800 7777",
        specialty,
        city,
        fee,
        languages: languages || "English",
        affiliation: affiliation || "Independent",
        bio: bio || "A dedicated healthcare professional.",
        qualifications: qualifications || "MD, Board Certified Specialist",
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
    await requireAdmin();
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

export async function toggleDoctorStatus(id: string, currentStatus: string) {
  try {
    await requireAdmin();
    const newStatus = currentStatus === "Active" ? "Paused" : "Active";
    const doctor = await prisma.doctor.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/admin/doctors");
    revalidatePath("/search");
    revalidatePath("/");
    
    return { success: true, status: newStatus };
  } catch (error: any) {
    console.error("Error toggling doctor status:", error);
    return { success: false, error: "Failed to update doctor status" };
  }
}
