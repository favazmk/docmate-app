import Link from "next/link";
import Image from "next/image";
import { Users, Calendar, Activity, TrendingUp, Search, Plus, Bell } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
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
    patient: b.user.name,
    doctor: b.doctor.name,
    date: b.date,
    time: b.timeSlot,
    status: b.status,
  }));

  // Simple mock count for new appointments (assuming we don't have an "isRead" flag yet)
  const newAppointmentsCount = 3;

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
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-primary text-white font-medium text-sm">
            <Activity className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/doctors" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-mid hover:bg-gray-100 font-medium text-sm transition-colors">
            <Users className="w-5 h-5" /> Doctors
          </Link>
          <Link href="/admin/appointments" className="flex items-center justify-between px-4 py-3 rounded-xl text-text-mid hover:bg-gray-100 font-medium text-sm transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" /> Appointments
            </div>
            {newAppointmentsCount > 0 && (
              <span className="bg-blue-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{newAppointmentsCount}</span>
            )}
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-border px-6 flex items-center justify-between">
          <h1 className="font-bold text-text-dark text-lg">Admin Overview</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-light" />
              <input type="text" placeholder="Search..." className="bg-gray-bg border border-gray-border rounded-lg h-9 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-primary" />
            </div>
            
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

        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-light text-blue-primary flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold text-green-badge bg-green-badge-bg px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> +12%</span>
              </div>
              <h3 className="text-text-light font-medium text-sm mb-1">Total Doctors</h3>
              <p className="text-3xl font-bold text-text-dark">{totalDoctors}</p>
            </div>
            
            <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold text-green-badge bg-green-badge-bg px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> +24%</span>
              </div>
              <h3 className="text-text-light font-medium text-sm mb-1">Total Bookings</h3>
              <p className="text-3xl font-bold text-text-dark">{totalBookings}</p>
            </div>

            <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold text-text-mid bg-gray-100 px-2 py-1 rounded-full">Active</span>
              </div>
              <h3 className="text-text-light font-medium text-sm mb-1">Live Emirates</h3>
              <p className="text-3xl font-bold text-text-dark">{liveEmirates}</p>
            </div>

            <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold text-green-badge bg-green-badge-bg px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> +8%</span>
              </div>
              <h3 className="text-text-light font-medium text-sm mb-1">Registered Patients</h3>
              <p className="text-3xl font-bold text-text-dark">{registeredPatients}</p>
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
                    <th className="px-6 py-4">Actions</th>
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
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          b.status === 'CONFIRMED' ? 'bg-green-badge-bg text-green-badge' :
                          b.status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-primary hover:underline font-medium">Manage</button>
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
