"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import CustomDropdown from "@/components/ui/CustomDropdown";
import Image from "next/image";
import { Users, Activity, Calendar, Search, Plus, X, Upload, CheckCircle2, Bell, Pause, Play, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDoctor, updateDoctor, deleteDoctor, toggleDoctorStatus } from "@/app/actions/doctors";
import { useRouter } from "next/navigation";

export default function DoctorsClient({ doctors, appointmentCount = 0 }: { doctors: any[], appointmentCount?: number }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const specialtyOptions = [
    "Gynecology",
    "Cardiology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Neurology",
    "Pulmonology"
  ];

  const areaOptions = [
    "Dubai Healthcare City",
    "Jumeirah",
    "Al Barsha",
    "Dubai Marina",
    "Bur Dubai",
    "Deira",
    "Business Bay",
    "Al Qusais",
    "Mirdif",
    "Nad Al Sheba"
  ];

  useEffect(() => {
    if (editingDoctor) {
      setSelectedSpecialty(editingDoctor.specialty);
      setSelectedArea(editingDoctor.city);
    } else {
      setSelectedSpecialty("");
      setSelectedArea("");
    }
  }, [editingDoctor, isAddModalOpen]);

  // Confirmation state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Alert state
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical-asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        const matchesSearch =
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.city.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
        const matchesCity = cityFilter === "all" || doc.city === cityFilter;
        const matchesSpecialty = specialtyFilter === "all" || doc.specialty === specialtyFilter;

        return matchesSearch && matchesStatus && matchesCity && matchesSpecialty;
      })
      .sort((a, b) => {
        if (sortBy === "alphabetical-asc") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "alphabetical-desc") {
          return b.name.localeCompare(a.name);
        } else if (sortBy === "date-desc") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "date-asc") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
      });
  }, [doctors, searchQuery, sortBy, statusFilter, cityFilter, specialtyFilter]);

  const uniqueCities = useMemo(() => {
    const cities = doctors.map((d) => d.city);
    return Array.from(new Set(cities));
  }, [doctors]);

  const uniqueSpecialties = useMemo(() => {
    const specialties = doctors.map((d) => d.specialty);
    return Array.from(new Set(specialties));
  }, [doctors]);

  const handleEdit = (doc: any) => {
    setEditingDoctor(doc);
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Doctor Profile?",
      description: "Are you sure you want to delete this doctor? This action is permanent and cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      isDanger: true,
      onConfirm: async () => {
        const res = await deleteDoctor(id);
        if (res.success) {
          router.refresh();
        } else {
          setAlertModal({
            isOpen: true,
            title: "Failed to Delete",
            description: res.error || "An error occurred while deleting the doctor profile."
          });
        }
      }
    });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const actionName = currentStatus === "Active" ? "pause" : "resume";
    setConfirmModal({
      isOpen: true,
      title: currentStatus === "Active" ? "Pause Doctor Profile?" : "Resume Doctor Profile?",
      description: `Are you sure you want to ${actionName} this doctor? This will ${currentStatus === "Active" ? "hide their profile from public searches" : "make their profile visible to patients again"}.`,
      confirmText: currentStatus === "Active" ? "Pause" : "Resume",
      cancelText: "Cancel",
      isDanger: currentStatus === "Active",
      onConfirm: async () => {
        const res = await toggleDoctorStatus(id, currentStatus);
        if (res.success) {
          router.refresh();
        } else {
          setAlertModal({
            isOpen: true,
            title: "Failed to Update Status",
            description: res.error || `An error occurred while attempting to ${actionName} the doctor profile.`
          });
        }
      }
    });
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

  const newAppointmentsCount = appointmentCount;

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

          {/* Filters Bar */}
          <div className="bg-white border border-gray-border rounded-2xl p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-center">
            {/* Search query */}
            <div className="relative flex-grow min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-text-light" />
              <input
                type="text"
                placeholder="Search by name, specialty, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-bg border border-gray-border rounded-xl h-11 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-bg border border-gray-border rounded-xl h-11 px-3 text-sm font-medium focus:outline-none focus:border-blue-primary"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
              </select>
            </div>

            {/* Specialty Filter */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="bg-gray-bg border border-gray-border rounded-xl h-11 px-3 text-sm font-medium focus:outline-none focus:border-blue-primary"
              >
                <option value="all">All Specialties</option>
                {uniqueSpecialties.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-gray-bg border border-gray-border rounded-xl h-11 px-3 text-sm font-medium focus:outline-none focus:border-blue-primary"
              >
                <option value="all">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-bg border border-gray-border rounded-xl h-11 px-3 text-sm font-medium focus:outline-none focus:border-blue-primary"
              >
                <option value="alphabetical-asc">Name (A → Z)</option>
                <option value="alphabetical-desc">Name (Z → A)</option>
                <option value="date-desc">Newest Added</option>
                <option value="date-asc">Oldest Added</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-xs font-bold text-text-mid uppercase tracking-wider px-1">
            <span>Showing {filteredDoctors.length} of {doctors.length} Doctors</span>
            {(searchQuery || statusFilter !== "all" || cityFilter !== "all" || specialtyFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSortBy("alphabetical-asc");
                  setStatusFilter("all");
                  setCityFilter("all");
                  setSpecialtyFilter("all");
                }}
                className="text-blue-primary hover:underline font-bold"
              >
                Clear Filters
              </button>
            )}
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
                    <th className="px-6 py-4">Clinic Email</th>
                    <th className="px-6 py-4">Clinic Phone</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-text-mid font-medium">No doctors found matching filters.</td>
                    </tr>
                  ) : filteredDoctors.map((doc) => (
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
                      <td className="px-6 py-4 text-text-mid">{doc.clinicEmail}</td>
                      <td className="px-6 py-4 text-text-mid">{doc.clinicPhone || "+971 800 7777"}</td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleStatus(doc.id, doc.status)} 
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title={doc.status === 'Active' ? 'Pause Doctor' : 'Resume Doctor'}
                        >
                          {doc.status === 'Active' ? (
                            <Pause className="w-4.5 h-4.5 text-amber-600" />
                          ) : (
                            <Play className="w-4.5 h-4.5 text-green-600" />
                          )}
                        </button>
                        <button 
                          onClick={() => handleEdit(doc)} 
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Profile"
                        >
                          <Pencil className="w-4.5 h-4.5 text-blue-primary" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)} 
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4.5 h-4.5 text-red-600" />
                        </button>
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
                    <label className="text-sm font-semibold text-text-dark">Clinic / Hospital Phone *</label>
                    <input required name="clinicPhone" defaultValue={editingDoctor?.clinicPhone || "+971 800 7777"} type="tel" placeholder="+971 800 7777" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Specialty *</label>
                    <CustomDropdown
                      value={selectedSpecialty}
                      onChange={setSelectedSpecialty}
                      options={specialtyOptions}
                      placeholder="Select Specialty"
                    />
                    <input type="hidden" name="specialty" value={selectedSpecialty} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Area (City) *</label>
                    <CustomDropdown
                      value={selectedArea}
                      onChange={setSelectedArea}
                      options={areaOptions}
                      placeholder="Select Area"
                    />
                    <input type="hidden" name="city" value={selectedArea} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Languages</label>
                    <input name="languages" defaultValue={editingDoctor?.languages} type="text" placeholder="English, Arabic" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Clinic / Hospital Email *</label>
                    <input required name="clinicEmail" defaultValue={editingDoctor?.clinicEmail} type="email" placeholder="info@kingscollegehospital.ae" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-dark">Clinic / Hospital Affiliation *</label>
                  <input required name="affiliation" defaultValue={editingDoctor?.affiliation} type="text" placeholder="e.g. Mediclinic City Hospital" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-dark">Qualifications (one per line) *</label>
                  <textarea required name="qualifications" defaultValue={editingDoctor?.qualifications || "MD, Board Certified Specialist"} rows={3} placeholder="MD, Board Certified Specialist&#10;Fellowship in Clinical Cardiology" className="bg-gray-bg border border-gray-border rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-blue-primary resize-none"></textarea>
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
      {/* Brand Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-border shadow-2xl w-full max-w-md p-6 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${confirmModal.isDanger ? "bg-red-50 text-red-600" : "bg-blue-light text-blue-primary"}`}>
              {confirmModal.isDanger ? <span className="text-2xl font-bold">⚠️</span> : <span className="text-2xl font-bold">ℹ️</span>}
            </div>
            <h3 className="text-lg font-bold text-text-dark mb-2">{confirmModal.title}</h3>
            <p className="text-sm text-text-mid mb-6 leading-relaxed">{confirmModal.description}</p>
            
            <div className="flex gap-3 w-full justify-center">
              <Button 
                variant="outline" 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="border-gray-border text-text-dark hover:bg-gray-200 h-11 px-5 rounded-xl font-bold flex-1"
              >
                {confirmModal.cancelText || "Cancel"}
              </Button>
              <Button 
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className={`h-11 px-5 rounded-xl font-bold flex-1 text-white ${confirmModal.isDanger ? "bg-red-600 hover:bg-red-700" : "bg-blue-primary hover:bg-blue-hover"}`}
              >
                {confirmModal.confirmText || "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-border shadow-2xl w-full max-w-md p-6 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">❌</span>
            </div>
            <h3 className="text-lg font-bold text-text-dark mb-2">{alertModal.title}</h3>
            <p className="text-sm text-text-mid mb-6 leading-relaxed">{alertModal.description}</p>
            
            <Button 
              onClick={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
              className="bg-blue-primary hover:bg-blue-hover text-white h-11 px-8 rounded-xl font-bold w-full shadow-lg shadow-blue-primary/20"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
