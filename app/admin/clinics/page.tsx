import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClinicsClient from "./ClinicsClient";


export const dynamic = 'force-dynamic';

export default async function AdminClinicsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const clinics = await prisma.clinic.findMany({
    orderBy: { name: "asc" },
    include: {
      hospitalGroup: true
    }
  });

  const hospitalGroups = await prisma.hospitalGroup.findMany({
    orderBy: { name: "asc" }
  });

  return <ClinicsClient clinics={clinics} hospitalGroups={hospitalGroups} />;
}
