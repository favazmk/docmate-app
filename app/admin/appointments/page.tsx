import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminAppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const appointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      doctor: true,
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-dark">All Bookings</h2>
              <p className="text-sm text-text-mid mt-1">Review all appointments scheduled through the platform.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-text-light uppercase tracking-wider font-semibold text-xs border-b border-gray-border">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-text-mid">No appointments found.</td>
                    </tr>
                  ) : appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text-dark">{apt.id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4 font-bold text-text-dark">{apt.patientName}</td>
                      <td className="px-6 py-4 text-text-mid">{apt.doctor?.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-text-mid">{apt.date}, {apt.timeSlot}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          apt.status === 'CONFIRMED' ? 'bg-green-badge-bg text-green-badge' :
                          apt.status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
