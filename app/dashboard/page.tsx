import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch user appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      user: {
        email: session.user.email,
      }
    },
    include: {
      doctor: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return <DashboardClient appointments={appointments} userName={session.user.name || null} />;
}
