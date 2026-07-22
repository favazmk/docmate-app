import prisma from "@/lib/prisma";
import Link from "next/link";
import { Users, Calendar, Activity } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import AdminAppointmentStatusSelect from "@/components/AdminAppointmentStatusSelect";
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const totalDoctors = await prisma.doctor.count();
  const totalBookings = await prisma.appointment.count();
  const registeredPatients = await prisma.user.count({ where: { role: 'PATIENT' } });
  
  const uniqueEmirates = await prisma.doctor.groupBy({
    by: ['city'],
  });
  const liveEmirates = uniqueEmirates.length;

  const rawBookings = await prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      doctor: true,
      user: true,
    }
  });

  const recentBookings = rawBookings.map(b => ({
    id: b.id.substring(0, 8).toUpperCase(),
    fullId: b.id,
    patient: b.patientName,
    doctor: b.doctor.name,
    date: b.date,
    time: b.timeSlot,
    status: b.status,
  }));

  return (
    <div className="min-h-screen flex">
      
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Admin Overview" />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          
          {/* Stats Cards - Bento Grid on Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
            <div className="bg-white border border-gray-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-light text-blue-primary flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-text-light font-medium text-xs sm:text-sm mb-1">Total Doctors</h3>
                <p className="text-2xl sm:text-3xl font-bold text-text-dark">{totalDoctors}</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-text-light font-medium text-xs sm:text-sm mb-1">Total Bookings</h3>
                <p className="text-2xl sm:text-3xl font-bold text-text-dark">{totalBookings}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-text-light font-medium text-xs sm:text-sm mb-1">Active Areas</h3>
                <p className="text-2xl sm:text-3xl font-bold text-text-dark">{liveEmirates}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-text-light font-medium text-xs sm:text-sm mb-1">Registered Patients</h3>
                <p className="text-2xl sm:text-3xl font-bold text-text-dark">{registeredPatients}</p>
              </div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white border border-gray-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-dark">Recent Bookings</h2>
              <Link href="/admin/appointments" className={`${buttonVariants({ variant: "outline", size: "sm" })} h-9`}>View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
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
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text-dark">{b.id}</td>
                      <td className="px-6 py-4 text-text-mid">{b.patient}</td>
                      <td className="px-6 py-4 text-text-mid font-medium">{b.doctor}</td>
                      <td className="px-6 py-4 text-text-mid">{b.date}, {b.time}</td>
                      <td className="px-6 py-4">
                        <AdminAppointmentStatusSelect appointmentId={b.fullId} initialStatus={b.status} />
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
