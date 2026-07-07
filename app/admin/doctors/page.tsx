import { PrismaClient } from "@prisma/client";
import DoctorsClient from "./DoctorsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminDoctorsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const doctors = await prisma.doctor.findMany({
    orderBy: { createdAt: "desc" }
  });

  const appointmentCount = await prisma.appointment.count();

  return <DoctorsClient doctors={doctors} appointmentCount={appointmentCount} />;
}
