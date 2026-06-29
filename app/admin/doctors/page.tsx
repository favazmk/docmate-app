"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Activity, Calendar, Search, Plus, X, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDoctorsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const doctorsList = [
    { id: "DOC-001", name: "Dr. Ahmed Al Mansouri", specialty: "Cardiologist", status: "Active", added: "2026-05-12" },
    { id: "DOC-002", name: "Dr. Sara Johnson", specialty: "Dermatologist", status: "Active", added: "2026-06-01" },
    { id: "DOC-003", name: "Dr. Khalid Omar", specialty: "Dentist", status: "Pending", added: "2026-06-28" },
  ];

  return (
    <div className="bg-gray-bg min-h-screen flex">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-white">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-text-dark flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-primary text-white flex items-center justify-center text-sm">doc</div>
            mate. <span className="text-xs font-semibold text-blue-primary uppercase tracking-wider ml-1">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-mid hover:bg-gray-100 font-medium text-sm transition-colors">
            <Activity className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/doctors" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-primary text-white font-medium text-sm">
            <Users className="w-5 h-5" /> Doctors
          </Link>
          <Link href="/admin/appointments" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-mid hover:bg-gray-100 font-medium text-sm transition-colors">
            <Calendar className="w-5 h-5" /> Appointments
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-border px-6 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-text-dark text-lg">Manage Doctors</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-light" />
              <input type="text" placeholder="Search..." className="bg-gray-bg border border-gray-border rounded-lg h-9 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-primary" />
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-light text-blue-primary flex items-center justify-center font-bold text-sm">A</div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-dark">Doctors Database</h2>
              <p className="text-sm text-text-mid mt-1">Add, update, or remove doctors from the platform.</p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-primary hover:bg-blue-hover text-white h-10 px-5 rounded-xl font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Doctor
            </Button>
          </div>

          {/* Doctors Table */}
          <div className="bg-white border border-gray-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-text-light uppercase tracking-wider font-semibold text-xs border-b border-gray-border">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date Added</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {doctorsList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text-dark">{doc.id}</td>
                      <td className="px-6 py-4 font-bold text-text-dark">{doc.name}</td>
                      <td className="px-6 py-4 text-text-mid">{doc.specialty}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          doc.status === 'Active' ? 'bg-green-badge-bg text-green-badge' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-mid">{doc.added}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-primary hover:underline font-medium text-sm">Edit Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Add Doctor Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-light text-blue-primary rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-dark">Add New Doctor</h3>
                  <p className="text-xs font-medium text-text-mid">Create a new provider profile for the platform</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-text-mid transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6">
              <form className="flex flex-col gap-8">
                
                {/* Photo Upload */}
                <div>
                  <label className="text-sm font-semibold text-text-dark block mb-3">Profile Photo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-border bg-gray-50 flex flex-col items-center justify-center text-text-mid hover:border-blue-primary hover:text-blue-primary transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                    </div>
                    <div className="text-sm text-text-mid">
                      <p>Upload a professional headshot.</p>
                      <p className="text-xs mt-1">Min 400x400px. PNG or JPG.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Dr. First Last" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Specialty <span className="text-red-500">*</span></label>
                    <select className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors">
                      <option>Cardiologist</option>
                      <option>Dermatologist</option>
                      <option>Dentist</option>
                      <option>Pediatrician</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Consultation Fee (AED) <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="e.g. 350" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Languages Spoken</label>
                    <input type="text" placeholder="English, Arabic" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-dark">Clinic / Hospital Affiliation <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. Mediclinic City Hospital, Dubai" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-dark">Professional Bio</label>
                  <textarea rows={4} placeholder="Write a short biography emphasizing experience and expertise..." className="bg-gray-bg border border-gray-border rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors resize-none"></textarea>
                </div>
                
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-gray-border bg-gray-50 rounded-b-3xl shrink-0 flex items-center justify-end gap-3">
              <Button onClick={() => setIsAddModalOpen(false)} variant="outline" className="border-gray-border text-text-dark hover:bg-gray-200 h-11 px-6 rounded-xl font-bold">
                Cancel
              </Button>
              <Button onClick={() => setIsAddModalOpen(false)} className="bg-blue-primary hover:bg-blue-hover text-white h-11 px-8 rounded-xl font-bold shadow-lg shadow-blue-primary/20 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save Doctor
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
