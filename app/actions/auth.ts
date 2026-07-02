"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerPatient(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: "An account with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "PATIENT",
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to create account" };
  }
}
