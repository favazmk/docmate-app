"use client";

import Link from "next/link";
import { CalendarCheck, LogOut, CheckCircle2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { User, Key } from "lucide-react";
import UserProfileForm from "@/components/UserProfileForm";
import UserPasswordForm from "@/components/UserPasswordForm";

export default function DashboardClient({ appointments, user }: { appointments: any[], user: any }) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'profile' | 'password'>('appointments');
  const userName = user?.name || null;
  
  // Basic separation 
  const upcomingAppointments = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING');
  const pastAppointments = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  return (
    <div className="min-h-screen">
      
      {/* Dashboard Nav */}
      <div className="bg-white border-b border-gray-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between md:justify-start gap-4 md:gap-8">
          <h1 className="font-bold text-text-dark text-base md:text-lg truncate shrink-0">Hello, {userName || "Patient"}</h1>
          <nav className="flex items-center gap-2 md:gap-6 overflow-x-auto py-1 no-scrollbar">
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`text-xs md:text-sm font-bold h-14 md:h-16 flex items-center border-b-2 whitespace-nowrap px-1 ${activeTab === 'appointments' ? 'text-blue-primary border-blue-primary' : 'text-text-mid border-transparent hover:text-text-dark'}`}
            >
              Appointments
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`text-xs md:text-sm font-bold h-14 md:h-16 flex items-center border-b-2 whitespace-nowrap px-1 ${activeTab === 'profile' ? 'text-blue-primary border-blue-primary' : 'text-text-mid border-transparent hover:text-text-dark'}`}
            >
              My Profile
            </button>
            <button 
              onClick={() => setActiveTab('password')}
              className={`text-xs md:text-sm font-bold h-14 md:h-16 flex items-center border-b-2 whitespace-nowrap px-1 ${activeTab === 'password' ? 'text-blue-primary border-blue-primary' : 'text-text-mid border-transparent hover:text-text-dark'}`}
            >
              Change Password
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-gray-border rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-3 px-2 py-2 border-b border-gray-border mb-2 pb-4">
               <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-border bg-gray-bg shrink-0">
                  <Image src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "Patient")}&background=random&color=fff`} alt={userName || "Patient"} fill className="object-cover" />
               </div>
               <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-text-dark truncate" title={userName || "Patient"}>{userName || "Patient"}</span>
                  {user?.email && <span className="text-xs text-text-mid truncate" title={user.email}>{user.email}</span>}
               </div>
            </div>
            <button onClick={() => setActiveTab('appointments')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left ${activeTab === 'appointments' ? 'bg-blue-light text-blue-primary' : 'text-text-mid hover:bg-gray-50 hover:text-text-dark'}`}>
              <CalendarCheck className="w-5 h-5" /> My Appointments
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left ${activeTab === 'profile' ? 'bg-blue-light text-blue-primary' : 'text-text-mid hover:bg-gray-50 hover:text-text-dark'}`}>
              <User className="w-5 h-5" /> My Profile
            </button>
            <button onClick={() => setActiveTab('password')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left ${activeTab === 'password' ? 'bg-blue-light text-blue-primary' : 'text-text-mid hover:bg-gray-50 hover:text-text-dark'}`}>
              <Key className="w-5 h-5" /> Change Password
            </button>
            <div className="h-px bg-gray-border my-2"></div>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium text-sm transition-colors text-left w-full">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-8">
          
          {activeTab === 'profile' ? (
            <UserProfileForm user={user} />
          ) : activeTab === 'password' ? (
            <UserPasswordForm user={user} />
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-text-dark mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="flex flex-col gap-4">
                {upcomingAppointments.map(apt => (
                  <div key={apt.id} className="bg-white border border-gray-border rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-border bg-gray-bg">
                        <Image src={apt.doctor.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor.name)}&background=2200CC&color=fff`} alt={apt.doctor.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-text-dark text-lg">{apt.doctor.name}</h3>
                        <span className="text-sm font-medium text-blue-primary">{apt.doctor.specialty}</span>
                        <div className="text-sm text-text-mid mt-2 leading-relaxed">
                          <p className="font-semibold text-text-dark">
                            {apt.date}
                            {!apt.timeSlot.toLowerCase().includes("pending") && ` at ${apt.timeSlot}`}
                          </p>
                          <p>{apt.doctor.city}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 bg-green-badge-bg text-green-badge px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" /> {apt.status}
                      </div>
                      <div className="flex gap-2 w-full md:w-auto mt-auto">
                        <Button variant="outline" className="flex-1 md:flex-none border-gray-border text-text-dark hover:bg-gray-bg h-10 px-4 rounded-xl text-xs font-bold">
                          Reschedule
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-10 px-4 rounded-xl text-xs font-bold">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-border rounded-2xl p-8 text-center shadow-sm">
                <p className="text-text-mid font-medium mb-4">You have no upcoming appointments.</p>
                <Link href="/" className={`${buttonVariants()} bg-blue-primary hover:bg-blue-hover text-white rounded-xl h-11 px-6 font-semibold shadow-md shadow-blue-primary/20`}>
                  Find a Doctor
                </Link>
              </div>
            )}
          </section>

          {pastAppointments.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-text-dark mb-4">Past Appointments</h2>
              <div className="flex flex-col gap-4">
                {pastAppointments.map(apt => (
                  <div key={apt.id} className="bg-white border border-gray-border rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-border bg-gray-bg grayscale opacity-80">
                        <Image src={apt.doctor.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor.name)}&background=059669&color=fff`} alt={apt.doctor.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-text-dark">{apt.doctor.name}</h3>
                        <p className="text-xs font-medium text-text-mid">{apt.date} • {apt.doctor.city}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                      <Button variant="outline" className="flex-1 md:flex-none border-gray-border text-text-dark hover:bg-gray-bg h-9 px-4 rounded-lg text-xs font-bold">
                        Leave Review
                      </Button>
                      <Button variant="outline" className="flex-1 md:flex-none border-blue-primary text-blue-primary hover:bg-blue-light h-9 px-4 rounded-lg text-xs font-bold">
                        Book Again
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
