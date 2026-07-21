import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch user profile and appointments
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      appointments: {
        include: {
          doctor: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <DashboardClient appointments={user.appointments} user={user} />;
}
