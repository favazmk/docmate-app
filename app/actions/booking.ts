"use server";

import prisma from "@/lib/prisma";
import { sendAppointmentEmails } from "@/lib/email";
import bcrypt from "bcryptjs";

export async function createAppointment(data: {
  doctorSlug: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reason?: string;
}) {
  try {
    // 1. Find the doctor
    const doctor = await prisma.doctor.findUnique({
      where: { slug: data.doctorSlug },
    });

    if (!doctor) {
      return { success: false, error: "Doctor not found" };
    }

    // 2. Check if a user with this email already exists, otherwise create a guest user
    let user = await prisma.user.findUnique({
      where: { email: data.patientEmail.toLowerCase() },
    });

    if (!user) {
      // Create a guest patient user
      // We generate a placeholder password for them which they can reset later
      const placeholderPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(placeholderPassword, 10);
      user = await prisma.user.create({
        data: {
          name: data.patientName,
          email: data.patientEmail.toLowerCase(),
          password: hashedPassword,
          phone: data.patientPhone,
          role: "PATIENT",
        },
      });
    }

    // 3. Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        doctorId: doctor.id,
        date: data.date,
        timeSlot: data.timeSlot,
        patientName: data.patientName,
        patientEmail: data.patientEmail.toLowerCase(),
        patientPhone: data.patientPhone,
        reason: data.reason || "",
        status: "CONFIRMED",
      },
    });

    // 4. Send Email Notifications
    sendAppointmentEmails({
      patientEmail: data.patientEmail.toLowerCase(),
      patientName: data.patientName,
      doctorEmail: doctor.email,
      doctorName: doctor.name,
      appointmentDate: data.date,
      appointmentTime: data.timeSlot,
    }).catch(console.error);

    return { success: true, appointmentId: appointment.id };
  } catch (error: any) {
    console.error("Booking error:", error);
    return { success: false, error: error?.message || "An error occurred during booking" };
  }
}
