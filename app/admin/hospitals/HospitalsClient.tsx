"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, CheckCircle2, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { createHospitalGroup, updateHospitalGroup, deleteHospitalGroup } from "@/app/actions/admin";

interface HospitalData {
  id: string;
  name: string;
  photoUrl: string | null;
}

interface HospitalsClientProps {
  hospitals: HospitalData[];
}

export default function HospitalsClient({ hospitals }: HospitalsClientProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<HospitalData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string;
  } | null>(null);

  const handleOpenAdd = () => {
    setEditingHospital(null);
    setName("");
    setPhotoUrl("");
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (h: HospitalData) => {
    setEditingHospital(h);
    setName(h.name);
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    let res;
    if (editingHospital) {
      res = await updateHospitalGroup(editingHospital.id, formData);
    } else {
      res = await createHospitalGroup(formData);
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
    const res = await deleteHospitalGroup(id);
    if (res.success) {
      setConfirmModal(null);
      router.refresh();
    } else {
      alert(res.error || "Failed to delete hospital group.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Hospital Groups Directory" badgeText={hospitals.length} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-dark">Hospital Groups (Networks)</h2>
              <p className="text-sm text-text-mid mt-1">Manage parent healthcare networks (e.g. King's College, Mediclinic).</p>
            </div>
            <Button onClick={handleOpenAdd} className="bg-blue-primary hover:bg-blue-hover text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-md shadow-blue-primary/20">
              <Plus className="w-5 h-5" /> Add Hospital Group
            </Button>
          </div>

          <div className="bg-white border border-gray-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-text-light uppercase tracking-wider font-semibold text-xs border-b border-gray-border">
                  <tr>
                    <th className="px-6 py-4">Logo</th>
                    <th className="px-6 py-4">Group Name</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {hospitals.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-text-mid font-medium">No groups found. Add one to get started!</td>
                    </tr>
                  ) : (
                    hospitals.map((h) => (
                      <tr key={h.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="relative w-12 h-12 rounded-xl border border-gray-border bg-gray-bg overflow-hidden flex items-center justify-center shrink-0">
                            {h.photoUrl ? (
                              <Image src={h.photoUrl} alt={h.name} fill className="object-cover" />
                            ) : (
                              <Building2 className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-text-dark">{h.name}</td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(h)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-blue-primary"
                            title="Edit Group"
                          >
                            <Pencil className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => setConfirmModal({ isOpen: true, id: h.id })}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-red-600"
                            title="Delete Group"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-border">
              <h3 className="text-lg font-bold text-text-dark">{editingHospital ? "Edit Hospital Group" : "Add Hospital Group"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-text-mid">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 flex flex-col gap-6">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-dark">Group Name *</label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="e.g. Mediclinic Middle East"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-dark">Logo Photo</label>
                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="bg-gray-bg border border-gray-border rounded-xl h-12 p-3 text-sm font-medium focus:outline-none focus:border-blue-primary"
                />
                {editingHospital?.photoUrl && (
                  <p className="text-xs text-text-mid mt-1">Current Logo: <a href={editingHospital.photoUrl} target="_blank" className="text-blue-primary underline">View Logo</a></p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-border mt-2">
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
            <h3 className="text-lg font-bold text-text-dark mb-2">Delete Hospital Group?</h3>
            <p className="text-sm text-text-mid mb-6 leading-relaxed">Are you sure? All clinic branches under this network will be deleted as well.</p>
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
