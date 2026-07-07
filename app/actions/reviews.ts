"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  doctorId: string;
  doctorSlug: string;
  patientName: string;
  rating: number;
  comment: string;
}) {
  try {
    if (!data.patientName.trim()) {
      return { success: false, error: "Please enter your name" };
    }
    if (!data.comment.trim()) {
      return { success: false, error: "Please enter a comment" };
    }
    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5 stars" };
    }

    // 1. Create the review
    await prisma.review.create({
      data: {
        doctorId: data.doctorId,
        patientName: data.patientName.trim(),
        rating: data.rating,
        comment: data.comment.trim(),
      },
    });

    // 2. Fetch all reviews for this doctor to update average rating and count
    const allReviews = await prisma.review.findMany({
      where: { doctorId: data.doctorId },
    });

    const reviewsCount = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount;

    // 3. Update Doctor metadata
    await prisma.doctor.update({
      where: { id: data.doctorId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviews: reviewsCount,
      },
    });

    // 4. Revalidate pages
    revalidatePath(`/doctors/${data.doctorSlug}`);
    revalidatePath("/search");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Error creating review:", error);
    return { success: false, error: error?.message || "Failed to submit review" };
  }
}
