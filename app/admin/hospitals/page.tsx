import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import HospitalsClient from "./HospitalsClient";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminHospitalsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const hospitals = await prisma.hospitalGroup.findMany({
    orderBy: { name: "asc" }
  });

  return <HospitalsClient hospitals={hospitals} />;
}
