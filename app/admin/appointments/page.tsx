import prisma from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import AdminAppointmentStatusSelect from "@/components/AdminAppointmentStatusSelect";
import AppointmentsClient from "./AppointmentsClient";

export const dynamic = 'force-dynamic';

export default async function AdminAppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const appointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      doctor: {
        include: {
          clinic: {
            include: {
              hospitalGroup: true
            }
          },
        }
      },
      user: true,
    }
  });

  return (
    <div className="min-h-screen flex">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader title="Manage Appointments" badgeText={appointments.length} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative">
          <AppointmentsClient appointments={appointments} />
        </main>
      </div>
    </div>
  );
}
