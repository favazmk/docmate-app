import prisma from "@/lib/prisma";
import { Suspense } from "react";
import DoctorsClient from "./DoctorsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";


export const dynamic = 'force-dynamic';

export default async function AdminDoctorsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const doctors = await prisma.doctor.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      specialtyRef: true,
      clinic: {
        include: {
          hospitalGroup: true
        }
      }
    }
  });

  const specialties = await prisma.specialty.findMany({
    orderBy: { name: "asc" }
  });

  const clinics = await prisma.clinic.findMany({
    orderBy: { name: "asc" },
    include: {
      hospitalGroup: true
    }
  });

  const appointmentCount = await prisma.appointment.count();

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <DoctorsClient
        doctors={doctors}
        specialties={specialties}
        clinics={clinics}
        appointmentCount={appointmentCount}
      />
    </Suspense>
  );
}
