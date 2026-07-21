"use server";
import prisma from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImages } from "@/lib/upload";


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
    const specialtyId = formData.get("specialtyId") as string;
    const clinicId = formData.get("clinicId") as string;
    const languages = formData.get("languages") as string;
    const bio = formData.get("bio") as string;
    const qualifications = formData.get("qualifications") as string;
    const feeStr = formData.get("fee") as string;
    const fee = feeStr ? parseInt(feeStr, 10) : 250;
    const availableDays = formData.get("availableDays") as string;
    const availableTime = formData.get("availableTime") as string;
    const newSpecialtyName = formData.get("newSpecialtyName") as string;
    const newSpecialtyIcon = formData.get("newSpecialtyIcon") as string || "Activity";
    
    // Resolve specialty details
    let specRecord = null;
    
    if (newSpecialtyName && newSpecialtyName.trim() !== "") {
      const nameVal = newSpecialtyName.trim();
      specRecord = await prisma.specialty.findUnique({ where: { name: nameVal }});
      if (!specRecord) {
        specRecord = await prisma.specialty.create({
          data: { name: nameVal, iconName: "Activity" }
        });
      }
    } else {
      specRecord = await prisma.specialty.findUnique({
        where: { id: specialtyId }
      });
    }
    
    if (!specRecord) throw new Error("Specialty is required");

    // Resolve clinic details
    const clinicRecord = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: { hospitalGroup: true }
    });
    if (!clinicRecord) throw new Error("Clinic branch is required");

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    const email = `dr.${slug}@kingscollegehospital.ae`;

    // Process uploaded doctor photos
    const photos = formData.getAll("photos") as File[];
    const uploadedPhotoUrl = await uploadImages(photos);
    const photoUrl = uploadedPhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

    const doctor = await prisma.doctor.create({
      data: {
        name,
        slug,
        email,
        specialtyId: specRecord.id,
        specialty: specRecord.name,
        clinicId: clinicRecord.id,
        clinicEmail: clinicRecord.email,
        clinicPhone: clinicRecord.phone,
        city: clinicRecord.city,
        fee,
        languages: languages || "English",
        affiliation: `${clinicRecord.hospitalGroup.name} - ${clinicRecord.name}`,
        bio: bio || "A dedicated healthcare professional.",
        qualifications: qualifications || "MD, Board Certified Specialist",
        photoUrl,
        status: "Active",
        availableDays: availableDays || "Mon - Fri",
        availableTime: availableTime || "09:00 AM - 05:00 PM",
      }
    });

    revalidatePath("/admin/doctors");
    revalidatePath("/search");
    revalidatePath("/");
    
    return { success: true, doctor };
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    return { success: false, error: error.message || "Failed to create doctor" };
  }
}

export async function updateDoctor(id: string, formData: FormData) {
  try {
    await requireAdmin();
    const name = formData.get("name") as string;
    const specialtyId = formData.get("specialtyId") as string;
    const clinicId = formData.get("clinicId") as string;
    const languages = formData.get("languages") as string;
    const bio = formData.get("bio") as string;
    const qualifications = formData.get("qualifications") as string;
    const feeStr = formData.get("fee") as string;
    const fee = feeStr ? parseInt(feeStr, 10) : 250;
    const availableDays = formData.get("availableDays") as string;
    const availableTime = formData.get("availableTime") as string;
    const newSpecialtyName = formData.get("newSpecialtyName") as string;
    const newSpecialtyIcon = formData.get("newSpecialtyIcon") as string || "Activity";

    // Resolve specialty details
    let specRecord = null;
    
    if (newSpecialtyName && newSpecialtyName.trim() !== "") {
      const nameVal = newSpecialtyName.trim();
      specRecord = await prisma.specialty.findUnique({ where: { name: nameVal }});
      if (!specRecord) {
        specRecord = await prisma.specialty.create({
          data: { name: nameVal, iconName: "Activity" }
        });
      }
    } else {
      specRecord = await prisma.specialty.findUnique({
        where: { id: specialtyId }
      });
    }
    
    if (!specRecord) throw new Error("Specialty is required");
    if (!specRecord) throw new Error("Specialty is required");

    // Resolve clinic details
    const clinicRecord = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: { hospitalGroup: true }
    });
    if (!clinicRecord) throw new Error("Clinic branch is required");

    // Process uploaded doctor photos if new ones are selected
    const photos = formData.getAll("photos") as File[];
    const uploadedPhotoUrl = await uploadImages(photos);

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        specialtyId: specRecord.id,
        specialty: specRecord.name,
        clinicId: clinicRecord.id,
        clinicEmail: clinicRecord.email,
        clinicPhone: clinicRecord.phone,
        city: clinicRecord.city,
        fee,
        languages: languages || "English",
        affiliation: `${clinicRecord.hospitalGroup.name} - ${clinicRecord.name}`,
        bio: bio || "A dedicated healthcare professional.",
        qualifications: qualifications || "MD, Board Certified Specialist",
        availableDays: availableDays || "Mon - Fri",
        availableTime: availableTime || "09:00 AM - 05:00 PM",
        ...(uploadedPhotoUrl ? { photoUrl: uploadedPhotoUrl } : {})
      }
    });

    revalidatePath("/admin/doctors");
    revalidatePath("/search");
    revalidatePath("/");
    
    return { success: true, doctor };
  } catch (error: any) {
    console.error("Error updating doctor:", error);
    return { success: false, error: error.message || "Failed to update doctor" };
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
