"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Activity, Calendar, Search, Plus, X, Upload, CheckCircle2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDoctor, updateDoctor, deleteDoctor } from "@/app/actions/doctors";
import { useRouter } from "next/navigation";

export default function DoctorsClient({ doctors }: { doctors: any[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleEdit = (doc: any) => {
    setEditingDoctor(doc);
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    const res = await deleteDoctor(id);
    if (res.success) {
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (editingDoctor) {
      res = await updateDoctor(editingDoctor.id, formData);
    } else {
      res = await createDoctor(formData);
    }

    setLoading(false);
    
    if (res.success) {
      setIsAddModalOpen(false);
      setEditingDoctor(null);
      router.refresh();
    } else {
      setErrorMsg(res.error || "An error occurred");
    }
  };

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
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-mid hover:bg-gray-100 font-medium text-sm transition-colors">
            <Activity className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/doctors" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-primary text-white font-medium text-sm">
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
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-border px-6 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-text-dark text-lg">Manage Doctors</h1>
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

        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-dark">Doctors Database</h2>
              <p className="text-sm text-text-mid mt-1">Add, update, or remove doctors from the platform.</p>
            </div>
            <Button onClick={openAddModal} className="bg-blue-primary hover:bg-blue-hover text-white h-10 px-5 rounded-xl font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Doctor
            </Button>
          </div>

          {/* Doctors Table */}
          <div className="bg-white border border-gray-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-text-light uppercase tracking-wider font-semibold text-xs border-b border-gray-border">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-text-dark">{doc.name}</td>
                      <td className="px-6 py-4 text-text-mid">{doc.specialty}</td>
                      <td className="px-6 py-4 text-text-mid">{doc.city}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          doc.status === 'Active' ? 'bg-green-badge-bg text-green-badge' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-mid">{doc.email}</td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <button onClick={() => handleEdit(doc)} className="text-blue-primary hover:underline font-medium text-sm">Edit</button>
                        <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:underline font-medium text-sm">Delete</button>
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
                  <h3 className="text-lg font-bold text-text-dark">{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</h3>
                  <p className="text-xs font-medium text-text-mid">{editingDoctor ? "Update provider profile" : "Create a new provider profile for the platform"}</p>
                </div>
              </div>
              <button onClick={() => { setIsAddModalOpen(false); setEditingDoctor(null); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-text-mid transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="add-doctor-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                    {errorMsg}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Full Name *</label>
                    <input required name="name" defaultValue={editingDoctor?.name} type="text" placeholder="Dr. First Last" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Email Address *</label>
                    <input required name="email" defaultValue={editingDoctor?.email} type="email" placeholder="doctor@docmate.com" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Specialty *</label>
                    <select required name="specialty" defaultValue={editingDoctor?.specialty} className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary">
                      <option>Cardiologist</option>
                      <option>Dermatologist</option>
                      <option>Orthopedics</option>
                      <option>Pediatrician</option>
                      <option>Dentist</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Emirate (City) *</label>
                    <select required name="city" defaultValue={editingDoctor?.city} className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary">
                      <option>Dubai</option>
                      <option>Abu Dhabi</option>
                      <option>Sharjah</option>
                      <option>Ajman</option>
                      <option>Umm Al Quwain</option>
                      <option>Ras Al Khaimah</option>
                      <option>Fujairah</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Languages</label>
                    <input name="languages" defaultValue={editingDoctor?.languages} type="text" placeholder="English, Arabic" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-dark">Clinic / Hospital Affiliation *</label>
                  <input required name="affiliation" defaultValue={editingDoctor?.affiliation} type="text" placeholder="e.g. Mediclinic City Hospital" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-dark">Professional Bio</label>
                  <textarea name="bio" defaultValue={editingDoctor?.bio} rows={3} placeholder="Short biography..." className="bg-gray-bg border border-gray-border rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-blue-primary resize-none"></textarea>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-gray-border bg-gray-50 rounded-b-3xl shrink-0 flex items-center justify-end gap-3">
              <Button type="button" onClick={() => setIsAddModalOpen(false)} variant="outline" className="border-gray-border text-text-dark hover:bg-gray-200 h-11 px-6 rounded-xl font-bold">
                Cancel
              </Button>
              <Button type="submit" form="add-doctor-form" disabled={loading} className="bg-blue-primary hover:bg-blue-hover text-white h-11 px-8 rounded-xl font-bold shadow-lg shadow-blue-primary/20 flex items-center gap-2">
                {loading ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save Doctor</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
