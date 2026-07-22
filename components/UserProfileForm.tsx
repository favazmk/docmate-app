"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/app/actions/user";
import PhotoUploader from "@/components/admin/PhotoUploader";

export default function UserProfileForm({ user }: { user: any }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setProfileMessage("");
    
    const formData = new FormData(e.currentTarget);
    try {
      await updateUserProfile(formData);
      setProfileMessage("Profile updated successfully!");
    } catch (error: any) {
      setProfileMessage(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="flex flex-col gap-8">
      {/* Profile Details Form */}
      <section className="bg-white border border-gray-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-dark mb-6">Personal & Health Details</h2>
        <form onSubmit={handleProfileUpdate} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <PhotoUploader
                label="Profile Picture"
                fileFieldName="photoUrl"
                keptUrlsFieldName="existingPhotoUrl"
                existingPhotoUrl={user.photoUrl}
                maxPhotos={1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-dark">Age</label>
              <Input name="age" type="number" defaultValue={user.age || ""} placeholder="e.g. 30" className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-dark">Height (cm)</label>
              <Input name="height" defaultValue={user.height || ""} placeholder="e.g. 175" className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-dark">Weight (kg)</label>
              <Input name="weight" defaultValue={user.weight || ""} placeholder="e.g. 70" className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-dark">Blood Group</label>
              <Input name="bloodGroup" defaultValue={user.bloodGroup || ""} placeholder="e.g. O+" className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-dark">Insurance Provider</label>
              <Input name="insuranceProvider" defaultValue={user.insuranceProvider || ""} placeholder="e.g. Daman, AXA" className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-text-dark">Health Conditions & Concerns</label>
              <textarea 
                name="healthConditions" 
                defaultValue={user.healthConditions || ""} 
                placeholder="Any ongoing conditions, allergies, or concerns..." 
                className="w-full border border-gray-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary/20 focus:border-blue-primary"
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button type="submit" disabled={isUpdating} className="bg-blue-primary hover:bg-blue-hover text-white rounded-xl px-8 font-semibold w-full sm:w-auto">
              {isUpdating ? "Saving..." : "Save Profile"}
            </Button>
            {profileMessage && (
              <span className={`text-sm font-medium ${profileMessage.includes("success") ? "text-green-600" : "text-red-500"}`}>
                {profileMessage}
              </span>
            )}
          </div>
        </form>
      </section>

    </div>
  );
}
