"use server";

import prisma from "@/lib/prisma";
import { sendAppointmentEmails } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    // 2. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: "You must be logged in to book an appointment" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User profile not found" };
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
        status: "PENDING",
      },
    });

    // 4. Send Email Notifications
    await sendAppointmentEmails({
      patientEmail: data.patientEmail.toLowerCase(),
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientReason: data.reason || "None specified",
      doctorEmail: doctor.clinicEmail || doctor.email,
      doctorName: doctor.name,
      clinicName: doctor.affiliation,
      appointmentDate: data.date,
      appointmentTime: data.timeSlot,
    }).catch(console.error);

    return { success: true, appointmentId: appointment.id };
  } catch (error: any) {
    console.error("Booking error:", error);
    return { success: false, error: error?.message || "An error occurred during booking" };
  }
}
