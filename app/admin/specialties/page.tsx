import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SpecialtiesClient from "./SpecialtiesClient";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminSpecialtiesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const specialties = await prisma.specialty.findMany({
    orderBy: { name: "asc" }
  });

  return <SpecialtiesClient specialties={specialties} />;
}
