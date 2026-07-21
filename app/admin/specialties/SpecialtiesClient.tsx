"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { createSpecialty, updateSpecialty, deleteSpecialty } from "@/app/actions/admin";
import * as Icons from "lucide-react";
import CustomDropdown from "@/components/ui/CustomDropdown";

interface SpecialtyData {
  id: string;
  name: string;
  iconName: string;
}

interface SpecialtiesClientProps {
  specialties: SpecialtyData[];
}

const AVAILABLE_ICONS = ["Activity", "Heart", "Eye", "Bone", "Baby", "Brain", "Stethoscope", "Sparkles", "User", "Smile"];

export default function SpecialtiesClient({ specialties }: SpecialtiesClientProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<SpecialtyData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("Activity");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string;
  } | null>(null);

  const handleOpenAdd = () => {
    setEditingSpecialty(null);
    setName("");
    setIconName("Activity");
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (spec: SpecialtyData) => {
    setEditingSpecialty(spec);
    setName(spec.name);
    setIconName(spec.iconName);
    setErrorMsg("");
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("iconName", iconName);

    let res;
    if (editingSpecialty) {
      res = await updateSpecialty(editingSpecialty.id, formData);
    } else {
      res = await createSpecialty(formData);
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
    const res = await deleteSpecialty(id);
    if (res.success) {
      setConfirmModal(null);
      router.refresh();
    } else {
      alert(res.error || "Failed to delete specialty.");
    }
  };

  const renderIcon = (name: string) => {
    const IconComponent = (Icons as any)[name] || Icons.Activity;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Specialties Directory" badgeText={specialties.length} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-dark">All Specialties</h2>
              <p className="text-sm text-text-mid mt-1">Manage specialties that doctors can be grouped under.</p>
            </div>
            <Button onClick={handleOpenAdd} className="bg-blue-primary hover:bg-blue-hover text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-md shadow-blue-primary/20">
              <Plus className="w-5 h-5" /> Add Specialty
            </Button>
          </div>

          <div className="bg-white border border-gray-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-text-light uppercase tracking-wider font-semibold text-xs border-b border-gray-border">
                  <tr>
                    <th className="px-6 py-4">Icon</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {specialties.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-text-mid font-medium">No specialties found. Add one to get started!</td>
                    </tr>
                  ) : (
                    specialties.map((spec) => (
                      <tr key={spec.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-blue-primary">
                          <div className="w-10 h-10 rounded-xl bg-blue-light flex items-center justify-center">
                            {renderIcon(spec.iconName)}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-text-dark">{spec.name}</td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(spec)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-blue-primary"
                            title="Edit Specialty"
                          >
                            <Pencil className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => setConfirmModal({ isOpen: true, id: spec.id })}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-red-600"
                            title="Delete Specialty"
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
              <h3 className="text-lg font-bold text-text-dark">{editingSpecialty ? "Edit Specialty" : "Add Specialty"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-text-mid">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-dark">Specialty Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Cardiology"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-dark">Select Icon *</label>
                <CustomDropdown
                  value={iconName}
                  onChange={setIconName}
                  placeholder="Select Icon"
                  options={AVAILABLE_ICONS.map(ico => {
                    const IconCmp = (Icons as any)[ico] || Icons.Activity;
                    return {
                      value: ico,
                      label: (
                        <div className="flex items-center gap-2">
                          <IconCmp className="w-4 h-4 text-blue-primary" />
                          <span>{ico}</span>
                        </div>
                      )
                    };
                  })}
                />
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
            <h3 className="text-lg font-bold text-text-dark mb-2">Delete Specialty?</h3>
            <p className="text-sm text-text-mid mb-6 leading-relaxed">Are you sure? Doctors linked to this specialty will lose their link reference.</p>
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
