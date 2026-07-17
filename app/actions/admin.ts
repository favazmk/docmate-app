"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImages } from "@/lib/upload";

const prisma = new PrismaClient();

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

const MAX_PHOTOS = 10;

function mergePhotoUrls(keptUrlsCsv: string, uploadedCsv: string): string {
  const kept = keptUrlsCsv.split(",").map((s) => s.trim()).filter(Boolean);
  const uploaded = uploadedCsv.split(",").map((s) => s.trim()).filter(Boolean);
  return [...kept, ...uploaded].join(",");
}

// ==========================================
// SPECIALTY ACTIONS
// ==========================================

export async function createSpecialty(formData: FormData) {
  try {
    await requireAdmin();
    const name = formData.get("name") as string;
    const iconName = formData.get("iconName") as string;

    if (!name) return { success: false, error: "Name is required" };

    const specialty = await prisma.specialty.create({
      data: {
        name,
        iconName: iconName || "Activity"
      }
    });

    revalidatePath("/admin/specialties");
    revalidatePath("/");
    revalidatePath("/search");
    return { success: true, specialty };
  } catch (error: any) {
    console.error("Error creating specialty:", error);
    return { success: false, error: error.message || "Failed to create specialty" };
  }
}

export async function updateSpecialty(id: string, formData: FormData) {
  try {
    await requireAdmin();
    const name = formData.get("name") as string;
    const iconName = formData.get("iconName") as string;

    if (!name) return { success: false, error: "Name is required" };

    const specialty = await prisma.specialty.update({
      where: { id },
      data: {
        name,
        iconName: iconName || "Activity"
      }
    });

    revalidatePath("/admin/specialties");
    revalidatePath("/");
    revalidatePath("/search");
    return { success: true, specialty };
  } catch (error: any) {
    console.error("Error updating specialty:", error);
    return { success: false, error: error.message || "Failed to update specialty" };
  }
}

export async function deleteSpecialty(id: string) {
  try {
    await requireAdmin();
    await prisma.specialty.delete({
      where: { id }
    });
    revalidatePath("/admin/specialties");
    revalidatePath("/");
    revalidatePath("/search");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting specialty:", error);
    return { success: false, error: error.message || "Failed to delete specialty" };
  }
}

// ==========================================
// HOSPITAL GROUP ACTIONS
// ==========================================

export async function createHospitalGroup(formData: FormData) {
  try {
    await requireAdmin();
    const name = formData.get("name") as string;
    const photos = formData.getAll("photos") as File[];
    const existingPhotos = (formData.get("existingPhotos") as string) || "";

    if (!name) return { success: false, error: "Name is required" };

    if (photos.filter((f) => f && f.size > 0).length + existingPhotos.split(",").filter(Boolean).length > MAX_PHOTOS) {
      return { success: false, error: `Maximum ${MAX_PHOTOS} photos allowed` };
    }

    const uploadedUrl = await uploadImages(photos);
    const merged = mergePhotoUrls(existingPhotos, uploadedUrl);
    const photoUrl = merged || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=500`;

    const hospitalGroup = await prisma.hospitalGroup.create({
      data: {
        name,
        photoUrl
      }
    });

    revalidatePath("/admin/hospitals");
    return { success: true, hospitalGroup };
  } catch (error: any) {
    console.error("Error creating hospital group:", error);
    return { success: false, error: error.message || "Failed to create hospital group" };
  }
}

export async function updateHospitalGroup(id: string, formData: FormData) {
  try {
    await requireAdmin();
    const name = formData.get("name") as string;
    const photos = formData.getAll("photos") as File[];
    const existingPhotos = (formData.get("existingPhotos") as string) || "";
    const photoUploaderTouched = formData.has("existingPhotos");

    if (!name) return { success: false, error: "Name is required" };

    if (photos.filter((f) => f && f.size > 0).length + existingPhotos.split(",").filter(Boolean).length > MAX_PHOTOS) {
      return { success: false, error: `Maximum ${MAX_PHOTOS} photos allowed` };
    }

    const uploadedUrl = await uploadImages(photos);
    const merged = mergePhotoUrls(existingPhotos, uploadedUrl);

    const hospitalGroup = await prisma.hospitalGroup.update({
      where: { id },
      data: {
        name,
        ...(photoUploaderTouched ? { photoUrl: merged || null } : {})
      }
    });

    revalidatePath("/admin/hospitals");
    return { success: true, hospitalGroup };
  } catch (error: any) {
    console.error("Error updating hospital group:", error);
    return { success: false, error: error.message || "Failed to update hospital group" };
  }
}

export async function deleteHospitalGroup(id: string) {
  try {
    await requireAdmin();
    await prisma.hospitalGroup.delete({
      where: { id }
    });
    revalidatePath("/admin/hospitals");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting hospital group:", error);
    return { success: false, error: error.message || "Failed to delete hospital group" };
  }
}

// ==========================================
// CLINIC BRANCH ACTIONS
// ==========================================

export async function createClinic(formData: FormData) {
  try {
    await requireAdmin();
    const hospitalGroupId = formData.get("hospitalGroupId") as string;
    const name = formData.get("name") as string;
    const city = formData.get("city") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const aboutUs = formData.get("aboutUs") as string;
    const photos = formData.getAll("photos") as File[];
    const existingPhotos = (formData.get("existingPhotos") as string) || "";

    if (!hospitalGroupId || !name || !city) {
      return { success: false, error: "Hospital Group, Branch Name, and City are required" };
    }

    if (photos.filter((f) => f && f.size > 0).length + existingPhotos.split(",").filter(Boolean).length > MAX_PHOTOS) {
      return { success: false, error: `Maximum ${MAX_PHOTOS} photos allowed` };
    }

    const uploadedUrl = await uploadImages(photos);
    const merged = mergePhotoUrls(existingPhotos, uploadedUrl);

    const clinic = await prisma.clinic.create({
      data: {
        hospitalGroupId,
        name,
        city,
        email: email || "info@clinic.com",
        phone: phone || "+971 800 7777",
        aboutUs: aboutUs || null,
        photoUrl: merged || null
      }
    });

    revalidatePath("/admin/clinics");
    revalidatePath("/");
    revalidatePath("/search");
    return { success: true, clinic };
  } catch (error: any) {
    console.error("Error creating clinic:", error);
    return { success: false, error: error.message || "Failed to create clinic branch" };
  }
}

export async function updateClinic(id: string, formData: FormData) {
  try {
    await requireAdmin();
    const hospitalGroupId = formData.get("hospitalGroupId") as string;
    const name = formData.get("name") as string;
    const city = formData.get("city") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const aboutUs = formData.get("aboutUs") as string;
    const photos = formData.getAll("photos") as File[];
    const existingPhotos = (formData.get("existingPhotos") as string) || "";
    const photoUploaderTouched = formData.has("existingPhotos");

    if (!hospitalGroupId || !name || !city) {
      return { success: false, error: "Hospital Group, Branch Name, and City are required" };
    }

    if (photos.filter((f) => f && f.size > 0).length + existingPhotos.split(",").filter(Boolean).length > MAX_PHOTOS) {
      return { success: false, error: `Maximum ${MAX_PHOTOS} photos allowed` };
    }

    const uploadedUrl = await uploadImages(photos);
    const merged = mergePhotoUrls(existingPhotos, uploadedUrl);

    const clinic = await prisma.clinic.update({
      where: { id },
      data: {
        hospitalGroupId,
        name,
        city,
        email: email || "info@clinic.com",
        phone: phone || "+971 800 7777",
        aboutUs: aboutUs || null,
        ...(photoUploaderTouched ? { photoUrl: merged || null } : {})
      }
    });

    revalidatePath("/admin/clinics");
    revalidatePath("/");
    revalidatePath("/search");
    return { success: true, clinic };
  } catch (error: any) {
    console.error("Error updating clinic:", error);
    return { success: false, error: error.message || "Failed to update clinic branch" };
  }
}

export async function deleteClinic(id: string) {
  try {
    await requireAdmin();
    await prisma.clinic.delete({
      where: { id }
    });
    revalidatePath("/admin/clinics");
    revalidatePath("/");
    revalidatePath("/search");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting clinic:", error);
    return { success: false, error: error.message || "Failed to delete clinic branch" };
  }
}
