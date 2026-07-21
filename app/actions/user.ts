"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

import { uploadImages } from "@/lib/upload";

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    const ageStr = formData.get("age") as string;
    const height = formData.get("height") as string;
    const weight = formData.get("weight") as string;
    const bloodGroup = formData.get("bloodGroup") as string;
    const insuranceProvider = formData.get("insuranceProvider") as string;
    const healthConditions = formData.get("healthConditions") as string;
    
    // Photo handling
    const photos = formData.getAll("photoUrl") as File[];
    const existingPhotos = formData.get("existingPhotoUrl") as string || "";
    const photoUploaderTouched = formData.has("existingPhotoUrl");
    
    let finalPhotoUrl = existingPhotos;
    if (photos && photos.length > 0 && photos[0].size > 0) {
      const uploadedUrl = await uploadImages(photos);
      if (uploadedUrl) {
        finalPhotoUrl = existingPhotos ? `${existingPhotos},${uploadedUrl}` : uploadedUrl;
      }
    }
    // Since users only need one photo, take the first one if multiple exist
    const singlePhotoUrl = finalPhotoUrl.split(",")[0]?.trim() || null;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        age: ageStr ? parseInt(ageStr, 10) : null,
        height: height || null,
        weight: weight || null,
        bloodGroup: bloodGroup || null,
        insuranceProvider: insuranceProvider || null,
        healthConditions: healthConditions || null,
        ...(photoUploaderTouched ? { photoUrl: singlePhotoUrl } : {}),
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile: " + error.message);
  }
}

export async function changeUserPassword(currentPassword?: string, newPassword?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // If the user already has a password, verify the current password
    if (user.password) {
      if (!currentPassword) {
        throw new Error("Current password is required");
      }
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new Error("Invalid current password");
      }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to change password:", error);
    throw new Error(error.message || "Failed to change password");
  }
}
