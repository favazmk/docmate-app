import { PrismaClient } from "@prisma/client";
import DoctorsClient from "./DoctorsClient";

const prisma = new PrismaClient();

export default async function AdminDoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <DoctorsClient doctors={doctors} />;
}
