"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import CustomDropdown from "@/components/ui/CustomDropdown";
import Image from "next/image";
import { Users, Activity, Calendar, Search, Plus, X, Upload, CheckCircle2, Bell, Pause, Play, Pencil, Trash2, AlertTriangle, Info, XCircle, Star } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDoctor, updateDoctor, deleteDoctor, toggleDoctorStatus, toggleDoctorFeatured } from "@/app/actions/doctors";
import { MAX_FEATURED_DOCTORS } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

const AVAILABLE_ICONS = ["Activity", "Heart", "Eye", "Bone", "Baby", "Brain", "Stethoscope", "Sparkles", "User", "Smile"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface SpecialtyData {
  id: string;
  name: string;
}

interface ClinicData {
  id: string;
  name: string;
  city: string;
  hospitalGroup: {
    id: string;
    name: string;
  };
}

export default function DoctorsClient({
  doctors,
  specialties = [],
  clinics = [],
  appointmentCount = 0
}: {
  doctors: any[];
  specialties?: SpecialtyData[];
  clinics?: ClinicData[];
  appointmentCount?: number;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams?.get("action");
    const initClinicId = searchParams?.get("clinicId");
    
    if (action === "add" && !isAddModalOpen) {
      setEditingDoctor(null);
      setErrorMsg("");
      if (initClinicId) {
        setClinicIds([initClinicId]);
      } else {
        setClinicIds([]);
      }
      setAreaOfExpertise("");
      setIsAddModalOpen(true);
      router.replace("/admin/doctors", { scroll: false });
    }
  }, [searchParams, router, isAddModalOpen]);

  const [specialtyId, setSpecialtyId] = useState("");
  const [isAddingNewSpecialty, setIsAddingNewSpecialty] = useState(false);
  const [newSpecialtyName, setNewSpecialtyName] = useState("");
  const [newSpecialtyIcon, setNewSpecialtyIcon] = useState("Activity");
  const [clinicIds, setClinicIds] = useState<string[]>([]);
  const [selectedHospitalGroupIds, setSelectedHospitalGroupIds] = useState<string[]>([]);
  const [doctorType, setDoctorType] = useState("Specialist");
  const [customDoctorType, setCustomDoctorType] = useState("");

  const hospitalGroups = useMemo(() => {
    const groups = new Map();
    clinics.forEach(c => {
      if (c.hospitalGroup) {
        groups.set(c.hospitalGroup.id, c.hospitalGroup);
      }
    });
    return Array.from(groups.values());
  }, [clinics]);

  const filteredModalClinics = useMemo(() => {
    if (selectedHospitalGroupIds.length === 0) return clinics;
    return clinics.filter(c => c.hospitalGroup && selectedHospitalGroupIds.includes(c.hospitalGroup.id));
  }, [clinics, selectedHospitalGroupIds]);

  const [areaOfExpertise, setAreaOfExpertise] = useState("");
  const [fee, setFee] = useState(250);
  const [availableDaysState, setAvailableDaysState] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  // Helper to parse 12hr "09:00 AM - 05:00 PM" into {start: "09:00", end: "17:00"}
  const parseTimeRange = (timeStr: string) => {
    try {
      const parts = timeStr.split(" - ");
      if (parts.length !== 2) return { start: "09:00", end: "17:00" };
      
      const parse12To24 = (t: string) => {
        const [time, modifier] = t.split(" ");
        const [hoursStr, minutes] = time.split(":");
        let hours = hoursStr;
        if (hours === "12") {
          hours = "00";
        }
        if (modifier === "PM") {
          hours = parseInt(hours, 10) + 12 + "";
        }
        return `${hours.padStart(2, "0")}:${minutes}`;
      };

      return { start: parse12To24(parts[0]), end: parse12To24(parts[1]) };
    } catch {
      return { start: "09:00", end: "17:00" };
    }
  };

  // Helper to convert 24hr "17:00" to 12hr "05:00 PM"
  const format24To12 = (time24: string) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    let h = parseInt(hours, 10);
    const modifier = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    if (h > 12) h -= 12;
    return `${h.toString().padStart(2, "0")}:${minutes} ${modifier}`;
  };

  const handleDayToggle = (day: string) => {
    setAvailableDaysState(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const specialtyOptions = specialties.map(s => ({
    value: s.id,
    label: s.name
  }));

  const clinicOptions = clinics.map(c => ({
    value: c.id,
    label: `${c.hospitalGroup.name} - ${c.name} (${c.city})`
  }));

  useEffect(() => {
    if (editingDoctor) {
      setSpecialtyId(editingDoctor.specialtyId || "");
      setIsAddingNewSpecialty(false);
      setNewSpecialtyName("");
      setClinicIds(editingDoctor.clinics?.map((c: any) => c.id) || []);
      const groupIds = new Set<string>();
      editingDoctor.clinics?.forEach((c: any) => {
         if (c.hospitalGroupId) groupIds.add(c.hospitalGroupId);
      });
      setSelectedHospitalGroupIds(Array.from(groupIds));
      setAreaOfExpertise(editingDoctor.areaOfExpertise || "");
      setFee(editingDoctor.fee || 250);

      const typeStr = editingDoctor.type || "Specialist";
      if (["General Physician", "Specialist", "Consultant"].includes(typeStr)) {
        setDoctorType(typeStr);
        setCustomDoctorType("");
      } else {
        setDoctorType("Other");
        setCustomDoctorType(typeStr);
      }
      
      if (editingDoctor.availableDays) {
        if (editingDoctor.availableDays.includes("-") || editingDoctor.availableDays.includes("Every") || editingDoctor.availableDays.includes("Weekend") || editingDoctor.availableDays.includes("Flexible")) {
          // If it's a legacy string like "Mon - Fri"
          if (editingDoctor.availableDays === "Mon - Fri") setAvailableDaysState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
          else if (editingDoctor.availableDays === "Every Day") setAvailableDaysState(WEEKDAYS);
          else if (editingDoctor.availableDays === "Weekends Only") setAvailableDaysState(["Sat", "Sun"]);
          else setAvailableDaysState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
        } else {
          // New format: comma-separated
          setAvailableDaysState(editingDoctor.availableDays.split(", "));
        }
      } else {
        setAvailableDaysState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
      }

      if (editingDoctor.availableTime) {
        const { start, end } = parseTimeRange(editingDoctor.availableTime);
        setStartTime(start);
        setEndTime(end);
      } else {
        setStartTime("09:00");
        setEndTime("17:00");
      }
    } else {
      setSpecialtyId("");
      setIsAddingNewSpecialty(false);
      setNewSpecialtyName("");
      setClinicIds([]);
      setSelectedHospitalGroupIds([]);
      setAreaOfExpertise("");
      setFee(250);
      setDoctorType("Specialist");
      setCustomDoctorType("");
      setAvailableDaysState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
      setStartTime("09:00");
      setEndTime("17:00");
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
  const [hospitalFilter, setHospitalFilter] = useState("all");
  const [clinicFilter, setClinicFilter] = useState("all");

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        const docCities = Array.from(new Set(doc.clinics.map((c: any) => c.city)));
        const matchesSearch =
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          docCities.some(city => typeof city === 'string' && city.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
        const matchesCity = cityFilter === "all" || docCities.includes(cityFilter);
        const matchesSpecialty = specialtyFilter === "all" || doc.specialty === specialtyFilter;
        
        const docHospitalGroups = Array.from(new Set(doc.clinics?.map((c: any) => c.hospitalGroup?.name).filter(Boolean)));
        const docClinicNames = Array.from(new Set(doc.clinics?.map((c: any) => c.name).filter(Boolean)));
        
        const matchesHospital = hospitalFilter === "all" || docHospitalGroups.includes(hospitalFilter);
        const matchesClinic = clinicFilter === "all" || docClinicNames.includes(clinicFilter);

        return matchesSearch && matchesStatus && matchesCity && matchesSpecialty && matchesHospital && matchesClinic;
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
  }, [doctors, searchQuery, sortBy, statusFilter, cityFilter, specialtyFilter, hospitalFilter, clinicFilter]);

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    doctors.forEach(d => {
      d.clinics?.forEach((c: any) => {
        if (c.city) cities.add(c.city);
      });
    });
    return Array.from(cities);
  }, [doctors]);

  const uniqueSpecialties = useMemo(() => {
    const specialties = doctors.map((d) => d.specialty);
    return Array.from(new Set(specialties)).filter(Boolean).sort();
  }, [doctors]);

  const uniqueHospitals = useMemo(() => {
    const hospitals = new Set<string>();
    doctors.forEach(d => {
      d.clinics?.forEach((c: any) => {
        if (c.hospitalGroup?.name) hospitals.add(c.hospitalGroup.name);
      });
    });
    return Array.from(hospitals).sort();
  }, [doctors]);

  const uniqueClinicsForFilter = useMemo(() => {
    const clinicSet = new Set<string>();
    doctors.forEach(d => {
      d.clinics?.forEach((c: any) => {
        if (hospitalFilter !== "all" && c.hospitalGroup?.name !== hospitalFilter) return;
        if (c.name) clinicSet.add(c.name);
      });
    });
    return Array.from(clinicSet).sort();
  }, [doctors, hospitalFilter]);

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

  const featuredCount = useMemo(() => doctors.filter((d) => d.isFeatured).length, [doctors]);

  const handleToggleFeatured = async (id: string, currentlyFeatured: boolean) => {
    const res = await toggleDoctorFeatured(id, currentlyFeatured);
    if (res.success) {
      router.refresh();
    } else {
      setAlertModal({
        isOpen: true,
        title: "Can't Feature Doctor",
        description: res.error || "An error occurred while updating the featured status."
      });
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

  const newAppointmentsCount = appointmentCount;

  return (
    <div className="min-h-screen flex">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader title="Manage Doctors" badgeText={doctors.length} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-dark">Doctors Database</h2>
              <p className="text-sm text-text-mid mt-1">Add, update, or remove doctors from the platform.</p>
              <p className="text-xs font-semibold text-text-mid mt-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {featuredCount}/{MAX_FEATURED_DOCTORS} featured on homepage
              </p>
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
            <div className="flex flex-col gap-1 min-w-[140px]">
              <CustomDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Statuses"
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "Active", label: "Active" },
                  { value: "Paused", label: "Paused" }
                ]}
              />
            </div>

            {/* Specialty Filter */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <CustomDropdown
                value={specialtyFilter}
                onChange={setSpecialtyFilter}
                placeholder="All Specialties"
                options={[
                  { value: "all", label: "All Specialties" },
                  ...uniqueSpecialties.map((spec) => ({ value: spec, label: spec }))
                ]}
              />
            </div>

            {/* City Filter */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <CustomDropdown
                value={cityFilter}
                onChange={setCityFilter}
                placeholder="All Cities"
                options={[
                  { value: "all", label: "All Cities" },
                  ...uniqueCities.map((city) => ({ value: city, label: city }))
                ]}
              />
            </div>

            {/* Hospital Filter */}
            <div className="flex flex-col gap-1 min-w-[180px]">
              <CustomDropdown
                value={hospitalFilter}
                onChange={(val) => {
                  setHospitalFilter(val);
                  setClinicFilter("all"); // Reset clinic filter when hospital changes
                }}
                placeholder="All Hospitals"
                options={[
                  { value: "all", label: "All Hospitals/Groups" },
                  ...uniqueHospitals.map((h) => ({ value: h, label: h }))
                ]}
              />
            </div>

            {/* Clinic Filter */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <CustomDropdown
                value={clinicFilter}
                onChange={setClinicFilter}
                placeholder="All Clinics"
                options={[
                  { value: "all", label: "All Clinics" },
                  ...uniqueClinicsForFilter.map((c) => ({ value: c, label: c }))
                ]}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col gap-1 min-w-[180px]">
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                placeholder="Sort By"
                options={[
                  { value: "alphabetical-asc", label: "Name (A → Z)" },
                  { value: "alphabetical-desc", label: "Name (Z → A)" },
                  { value: "date-desc", label: "Newest Added" },
                  { value: "date-asc", label: "Oldest Added" }
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-xs font-bold text-text-mid uppercase tracking-wider px-1">
            <span>Showing {filteredDoctors.length} of {doctors.length} Doctors</span>
            {(searchQuery || statusFilter !== "all" || cityFilter !== "all" || specialtyFilter !== "all" || hospitalFilter !== "all" || clinicFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSortBy("alphabetical-asc");
                  setStatusFilter("all");
                  setCityFilter("all");
                  setSpecialtyFilter("all");
                  setHospitalFilter("all");
                  setClinicFilter("all");
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
                    <th className="px-6 py-4" title="Position on the public Find a doctor page">Pos.</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">Clinics</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-text-mid font-medium">No doctors found matching filters.</td>
                    </tr>
                  ) : filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        {doc.displayOrder && doc.displayOrder !== 9999 ? (
                          <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-lg bg-blue-light text-blue-primary text-xs font-bold">
                            {doc.displayOrder}
                          </span>
                        ) : (
                          <span className="text-text-light text-xs" title="Not positioned — appears after all pinned doctors">&mdash;</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-text-dark">{doc.name}</td>
                      <td className="px-6 py-4">
                        <div className="text-text-dark font-medium">{doc.specialty}</div>
                        {doc.type && <div className="text-xs text-text-mid mt-0.5">{doc.type}</div>}
                      </td>
                      <td className="px-6 py-4">
                        {doc.clinics && doc.clinics.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {doc.clinics.map((c: any, index: number) => (
                              <span key={index} className="text-text-dark font-medium text-xs">
                                {c.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-text-mid text-xs">No Clinics</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          doc.status === 'Active' ? 'bg-green-badge-bg text-green-badge' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <button
                          onClick={() => handleToggleFeatured(doc.id, doc.isFeatured)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title={doc.isFeatured ? 'Remove from Homepage Featured' : 'Feature on Homepage'}
                        >
                          <Star className={`w-4.5 h-4.5 ${doc.isFeatured ? 'text-amber-500 fill-amber-500' : 'text-text-light'}`} />
                        </button>
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
              <form id="add-doctor-form" onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-6">
                
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
                    <label className="text-sm font-semibold text-text-dark">Languages</label>
                    <input name="languages" defaultValue={editingDoctor?.languages || "English"} type="text" placeholder="English, Arabic" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-text-dark">Specialty *</label>
                      <button 
                        type="button" 
                        onClick={() => { setIsAddingNewSpecialty(!isAddingNewSpecialty); setSpecialtyId(""); setNewSpecialtyName(""); setNewSpecialtyIcon("Activity"); }}
                        className="text-xs text-blue-primary hover:underline font-medium"
                      >
                        {isAddingNewSpecialty ? "Choose Existing" : "+ Add New"}
                      </button>
                    </div>
                    {isAddingNewSpecialty ? (
                      <div className="flex gap-2">
                        <input 
                          required 
                          name="newSpecialtyName" 
                          value={newSpecialtyName}
                          onChange={(e) => setNewSpecialtyName(e.target.value)}
                          type="text" 
                          placeholder="Enter new specialty name" 
                          className="flex-1 bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary" 
                        />
                        <div className="w-40">
                          <CustomDropdown
                            value={newSpecialtyIcon}
                            onChange={setNewSpecialtyIcon}
                            placeholder="Icon"
                            options={AVAILABLE_ICONS.map(i => {
                              const IconCmp = (Icons as any)[i] || Icons.Activity;
                              return {
                                value: i,
                                label: (
                                  <div className="flex items-center gap-2">
                                    <IconCmp className="w-4 h-4 text-blue-primary" />
                                    <span>{i}</span>
                                  </div>
                                )
                              };
                            })}
                          />
                          <input type="hidden" name="newSpecialtyIcon" value={newSpecialtyIcon} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <CustomDropdown
                          value={specialtyId}
                          onChange={setSpecialtyId}
                          options={specialtyOptions}
                          placeholder="Select Specialty"
                        />
                        <input type="hidden" name="specialtyId" value={specialtyId} />
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Doctor Type *</label>
                    <CustomDropdown
                      value={doctorType}
                      onChange={setDoctorType}
                      options={[
                        { value: "General Physician", label: "General Physician" },
                        { value: "Specialist", label: "Specialist" },
                        { value: "Consultant", label: "Consultant" },
                        { value: "Other", label: "Other (Custom)" },
                      ]}
                      placeholder="Select Type"
                    />
                    {doctorType === "Other" && (
                      <input 
                        type="text" 
                        value={customDoctorType}
                        onChange={(e) => setCustomDoctorType(e.target.value)}
                        placeholder="Enter custom type..."
                        className="mt-2 bg-gray-bg border border-gray-border rounded-xl h-11 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
                      />
                    )}
                    <input type="hidden" name="type" value={doctorType === "Other" ? customDoctorType : doctorType} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Main Hospital Groups (Filter Branches)</label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border border-gray-border rounded-xl p-3 bg-gray-bg">
                      {hospitalGroups.map((group: any) => (
                        <label key={group.id} className="flex items-center gap-2 cursor-pointer bg-white border border-gray-border px-3 py-1.5 rounded-lg hover:border-blue-primary transition-colors text-sm font-medium w-full">
                          <input 
                            type="checkbox" 
                            value={group.id}
                            checked={selectedHospitalGroupIds.includes(group.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedHospitalGroupIds([...selectedHospitalGroupIds, group.id]);
                              } else {
                                setSelectedHospitalGroupIds(selectedHospitalGroupIds.filter(id => id !== group.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-primary rounded focus:ring-blue-primary"
                          />
                          <div className="flex flex-col flex-1">
                            <span>{group.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Clinic Branches * (Select one or more)</label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border border-gray-border rounded-xl p-3 bg-gray-bg">
                      {filteredModalClinics.map(clinic => (
                        <label key={clinic.id} className="flex items-center gap-2 cursor-pointer bg-white border border-gray-border px-3 py-1.5 rounded-lg hover:border-blue-primary transition-colors text-sm font-medium w-full">
                          <input 
                            type="checkbox" 
                            value={clinic.id}
                            checked={clinicIds.includes(clinic.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setClinicIds([...clinicIds, clinic.id]);
                              } else {
                                setClinicIds(clinicIds.filter(id => id !== clinic.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-primary rounded focus:ring-blue-primary"
                          />
                          <div className="flex flex-col flex-1">
                            <span>{clinic.name}</span>
                            <span className="text-xs text-text-light">{clinic.hospitalGroup?.name} - {clinic.city}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    <input type="hidden" name="clinicIds" value={JSON.stringify(clinicIds)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Display Position</label>
                    <input
                      name="displayOrder"
                      defaultValue={
                        editingDoctor?.displayOrder && editingDoctor.displayOrder !== 9999
                          ? editingDoctor.displayOrder
                          : ""
                      }
                      type="number"
                      min={1}
                      step={1}
                      placeholder="e.g. 1 for the top of the list"
                      className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
                    />
                    <span className="text-xs text-text-light">
                      Controls where this doctor appears on the public &quot;Find a doctor&quot; page
                      under the default Recommended order. <strong>1</strong> puts them first,
                      <strong> 2</strong> second, and so on. Leave empty and they appear after all
                      positioned doctors, newest first. Ties are broken by newest first, so avoid
                      giving two doctors the same number.
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Experience</label>
                    <input
                      name="experience"
                      defaultValue={editingDoctor?.experience || ""}
                      type="text"
                      placeholder="e.g. 15 or 15+ Years"
                      className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
                    />
                    <span className="text-xs text-text-light">
                      Shown on the doctor&apos;s public profile. Leave empty to hide the experience badge.
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Area of Expertise</label>
                    <textarea
                      name="areaOfExpertise"
                      defaultValue={editingDoctor?.areaOfExpertise || ""}
                      placeholder="Specialized focus areas..."
                      className="bg-gray-bg border border-gray-border rounded-xl h-48 p-4 text-sm font-medium focus:outline-none focus:border-blue-primary resize-none"
                    />
                  </div>
                </div>

                <input type="hidden" name="fee" value={fee} />
                <input type="hidden" name="availableDays" value={availableDaysState.length > 0 ? availableDaysState.join(", ") : "Not set"} />
                <input type="hidden" name="availableTime" value={`${format24To12(startTime)} - ${format24To12(endTime)}`} />

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Available Days *</label>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {WEEKDAYS.map(day => (
                        <label key={day} className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-border px-3 py-1.5 rounded-lg hover:border-blue-primary transition-colors">
                          <input 
                            type="checkbox" 
                            checked={availableDaysState.includes(day)}
                            onChange={() => handleDayToggle(day)}
                            className="w-4 h-4 text-blue-primary rounded focus:ring-blue-primary"
                          />
                          <span className="text-sm font-medium text-text-dark">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-dark">Available Time *</label>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col w-full md:w-1/2">
                        <span className="text-xs text-text-light mb-1">Start Time</span>
                        <input 
                          type="time" 
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="bg-gray-bg border border-gray-border rounded-xl h-11 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary cursor-pointer w-full" 
                        />
                      </div>
                      <span className="text-text-light mt-4">-</span>
                      <div className="flex flex-col w-full md:w-1/2">
                        <span className="text-xs text-text-light mb-1">End Time</span>
                        <input 
                          type="time" 
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="bg-gray-bg border border-gray-border rounded-xl h-11 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary cursor-pointer w-full" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-dark">Doctor Photos (Upload one or more)</label>
                  <input 
                    name="photos" 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="bg-gray-bg border border-gray-border rounded-xl h-12 p-3 text-sm font-medium focus:outline-none focus:border-blue-primary" 
                  />
                  {editingDoctor?.photoUrl && (
                    <div className="mt-1 flex flex-col gap-1">
                      <span className="text-[10px] text-text-light font-semibold uppercase tracking-wider block">Current Photo(s):</span>
                      <div className="flex gap-2 flex-wrap">
                        {editingDoctor.photoUrl.split(',').map((url: string, idx: number) => (
                          <a key={idx} href={url} target="_blank" className="text-xs text-blue-primary hover:underline font-semibold bg-gray-100 px-2 py-1 rounded-md">
                            Photo {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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
              {confirmModal.isDanger ? <AlertTriangle className="w-7 h-7" /> : <Info className="w-7 h-7" />}
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
              <XCircle className="w-7 h-7" />
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
