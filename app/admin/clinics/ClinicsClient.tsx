"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, CheckCircle2, X, Building, MapPin, Phone, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomDropdown from "@/components/ui/CustomDropdown";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import PhotoUploader from "@/components/admin/PhotoUploader";
import { createClinic, updateClinic, deleteClinic } from "@/app/actions/admin";

interface ClinicData {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  aboutUs: string | null;
  hospitalGroup: {
    id: string;
    name: string;
  };
}

interface HospitalGroupData {
  id: string;
  name: string;
}

interface ClinicsClientProps {
  clinics: ClinicData[];
  hospitalGroups: HospitalGroupData[];
}

export default function ClinicsClient({ clinics, hospitalGroups }: ClinicsClientProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<ClinicData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams?.get("action");
    const initHospitalId = searchParams?.get("hospitalId");
    
    if (action === "add" && !isAddModalOpen) {
      setEditingClinic(null);
      setErrorMsg("");
      if (initHospitalId) {
        setHospitalGroupId(initHospitalId);
      } else {
        setHospitalGroupId(hospitalGroups[0]?.id || "");
      }
      setIsAddModalOpen(true);
      router.replace("/admin/clinics", { scroll: false });
    }
  }, [searchParams, router, isAddModalOpen, hospitalGroups]);

  // Form fields
  const [name, setName] = useState("");
  const [hospitalGroupId, setHospitalGroupId] = useState("");
  const [city, setCity] = useState("Dubai");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string;
  } | null>(null);

  const handleOpenAdd = () => {
    setEditingClinic(null);
    setName("");
    setHospitalGroupId(hospitalGroups[0]?.id || "");
    setCity("Dubai");
    setEmail("");
    setPhone("");
    setPhotoUrl("");
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (c: ClinicData) => {
    setEditingClinic(c);
    setName(c.name);
    setHospitalGroupId(c.hospitalGroup.id);
    setCity(c.city);
    setEmail(c.email);
    setPhone(c.phone);
    setPhotoUrl(c.photoUrl || "");
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    let res;
    if (editingClinic) {
      res = await updateClinic(editingClinic.id, formData);
    } else {
      res = await createClinic(formData);
    }

    setLoading(false);
    if (res.success) {
      setIsAddModalOpen(false);
      router.refresh();
    } else {
      setErrorMsg(res.error || "Something went wrong.");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteClinic(id);
    if (res.success) {
      setConfirmModal(null);
      router.refresh();
    } else {
      alert(res.error || "Failed to delete clinic branch.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Clinic Branches Directory" badgeText={clinics.length} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-dark">Clinic Branches</h2>
              <p className="text-sm text-text-mid mt-1">Manage physical branches across Dubai, Sharjah, and Ajman.</p>
            </div>
            <Button onClick={handleOpenAdd} className="bg-blue-primary hover:bg-blue-hover text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-md shadow-blue-primary/20">
              <Plus className="w-5 h-5" /> Add Branch
            </Button>
          </div>

          <div className="bg-white border border-gray-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-text-light uppercase tracking-wider font-semibold text-xs border-b border-gray-border">
                  <tr>
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-6 py-4">Hospital Group</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Add Doctors</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {clinics.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-text-mid font-medium">No clinic branches found. Add one to get started!</td>
                    </tr>
                  ) : (
                    clinics.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-text-dark">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg border border-gray-border overflow-hidden bg-gray-50 flex items-center justify-center">
                              {c.photoUrl ? (
                                <Image src={c.photoUrl} alt={c.name} fill className="object-cover" />
                              ) : (
                                <Building className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-text-dark">{c.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-text-mid font-medium">{c.hospitalGroup.name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-text-dark text-xs font-semibold px-2.5 py-1 rounded-full">
                            <MapPin className="w-3 h-3 text-blue-primary" /> {c.city}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex flex-col gap-1 text-xs text-text-mid">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {c.email}</span>
                          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {c.phone}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/doctors?action=add&clinicId=${c.id}`}
                            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg transition-colors text-xs"
                            title="Add Doctor"
                          >
                            <UserPlus className="w-4 h-4" /> Add Doctor
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleOpenEdit(c)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-blue-primary flex items-center justify-center"
                              title="Edit Branch"
                            >
                              <Pencil className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => setConfirmModal({ isOpen: true, id: c.id })}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-red-600"
                              title="Delete Branch"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-border">
              <h3 className="text-lg font-bold text-text-dark">{editingClinic ? "Edit Clinic Branch" : "Add Clinic Branch"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-text-mid">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 flex flex-col gap-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-dark">Branch Name *</label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="e.g. Jumeirah Clinic"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-bg border border-gray-border rounded-xl h-11 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5 z-50">
                <label className="text-sm font-semibold text-text-dark">Hospital Group *</label>
                <CustomDropdown
                  value={hospitalGroupId}
                  onChange={setHospitalGroupId}
                  placeholder="Select Hospital Group"
                  options={hospitalGroups.map(g => ({ value: g.id, label: g.name }))}
                />
                <input type="hidden" name="hospitalGroupId" value={hospitalGroupId} required />
              </div>

              <div className="flex flex-col gap-1.5 z-40">
                <label className="text-sm font-semibold text-text-dark">City *</label>
                <CustomDropdown
                  value={city}
                  onChange={setCity}
                  placeholder="Select City"
                  options={[
                    { value: "Dubai", label: "Dubai" },
                    { value: "Sharjah", label: "Sharjah" },
                    { value: "Ajman", label: "Ajman" }
                  ]}
                />
                <input type="hidden" name="city" value={city} required />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-dark">Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="info@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-bg border border-gray-border rounded-xl h-11 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-dark">Phone Number</label>
                <input
                  name="phone"
                  type="text"
                  placeholder="+971 4 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-bg border border-gray-border rounded-xl h-11 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-dark">About Us</label>
                <textarea
                  name="aboutUs"
                  defaultValue={editingClinic?.aboutUs || ""}
                  rows={4}
                  placeholder="A short description of this branch, shown publicly on its profile page..."
                  className="bg-gray-bg border border-gray-border rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-blue-primary resize-none"
                ></textarea>
              </div>

              <PhotoUploader
                key={editingClinic?.id ?? "new"}
                existingPhotoUrl={editingClinic?.photoUrl}
                fileFieldName="photos"
                keptUrlsFieldName="existingPhotos"
                label="Branch Photos"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-border mt-4">
                <Button type="button" onClick={() => setIsAddModalOpen(false)} variant="outline" className="h-11 px-6 rounded-xl font-bold border-gray-border hover:bg-gray-200">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-primary hover:bg-blue-hover text-white h-11 px-8 rounded-xl font-bold shadow-lg shadow-blue-primary/20 flex items-center gap-2">
                  {loading ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 text-center max-w-sm w-full">
            <h3 className="text-lg font-bold text-text-dark mb-2">Delete Clinic Branch?</h3>
            <p className="text-sm text-text-mid mb-6 leading-relaxed">Are you sure? Doctors associated with this clinic branch will lose their location link.</p>
            <div className="flex gap-3">
              <Button onClick={() => setConfirmModal(null)} variant="outline" className="flex-1 h-11 rounded-xl font-bold border-gray-border hover:bg-gray-200">
                Cancel
              </Button>
              <Button onClick={() => handleDelete(confirmModal.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white h-11 rounded-xl font-bold">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
