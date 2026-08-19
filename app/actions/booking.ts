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
  clinicId?: string;
}) {
  try {
    // 1. Find the doctor
    const doctor = await prisma.doctor.findUnique({
      where: { slug: data.doctorSlug },
    });

    if (!doctor || doctor.status !== "Active") {
      return { success: false, error: "Doctor is currently not active or not found" };
    }

    let clinicName = "the clinic";
    let clinicEmail = doctor.email;

    if (data.clinicId) {
      const clinic = await prisma.clinic.findUnique({
        where: { id: data.clinicId },
        include: { hospitalGroup: true }
      });
      if (clinic) {
        clinicName = `${clinic.hospitalGroup.name} - ${clinic.name}`;
        if (clinic.email) clinicEmail = clinic.email;
      }
    }

    // 2. Authenticate the user (optional for guest booking)
    const session = await getServerSession(authOptions);
    let userId: string | null = null;
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) {
        userId = user.id;
      }
    }

    // 3. Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: userId,
        doctorId: doctor.id,
        date: data.date,
        timeSlot: data.timeSlot,
        patientName: data.patientName,
        patientEmail: data.patientEmail.toLowerCase(),
        patientPhone: data.patientPhone,
        reason: data.reason || "",
        status: "PENDING",
        clinicId: data.clinicId,
      },
    });

    // 4. Send Email Notifications
    await sendAppointmentEmails({
      patientEmail: data.patientEmail.toLowerCase(),
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientReason: data.reason || "None specified",
      doctorEmail: clinicEmail,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorType: doctor.type,
      clinicName: clinicName,
      appointmentDate: data.date,
      appointmentTime: data.timeSlot,
    }).catch(console.error);

    return { success: true, appointmentId: appointment.id };
  } catch (error: any) {
    console.error("Booking error:", error);
    return { success: false, error: error?.message || "An error occurred during booking" };
  }
}

export async function getAppointmentsByEmailAndPhone(email: string, phone: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientEmail: email.toLowerCase().trim(),
        patientPhone: phone.trim(),
      },
      include: {
        doctor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, appointments };
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return { success: false, error: "Failed to fetch appointments" };
  }
}
