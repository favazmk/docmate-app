import Link from "next/link";
import Image from "next/image";
import { Users, Activity, Calendar, Search, Bell } from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      doctor: true,
      user: true,
    }
  });

  const newAppointmentsCount = appointments.length;

  return (
    <div className="bg-gray-bg min-h-screen flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-white">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Doc Mate Logo" width={110} height={32} className="object-contain" priority />
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-mid hover:bg-gray-100 font-medium text-sm transition-colors">
            <Activity className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/doctors" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-mid hover:bg-gray-100 font-medium text-sm transition-colors">
            <Users className="w-5 h-5" /> Doctors
          </Link>
          <Link href="/admin/appointments" className="flex items-center justify-between px-4 py-3 rounded-xl bg-blue-primary text-white font-medium text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" /> Appointments
            </div>
            {newAppointmentsCount > 0 && (
              <span className="bg-white text-blue-primary text-xs font-bold px-2 py-0.5 rounded-full">{newAppointmentsCount}</span>
            )}
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-border px-6 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-text-dark text-lg">Manage Appointments</h1>
          <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <Link href="/admin/appointments" className="relative p-2 text-text-mid hover:text-blue-primary transition-colors">
              <Bell className="w-5 h-5" />
              {newAppointmentsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </Link>

            <div className="w-8 h-8 rounded-full bg-blue-light text-blue-primary flex items-center justify-center font-bold text-sm">A</div>
          </div>
        </header>

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
