"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changeUserPassword } from "@/app/actions/user";

export default function UserPasswordForm({ user }: { user: any }) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage("");

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      setIsChangingPassword(false);
      return;
    }

    try {
      await changeUserPassword(currentPassword, newPassword);
      setPasswordMessage("Password changed successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setPasswordMessage(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <section className="bg-white border border-gray-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-text-dark mb-6">Change Password</h2>
      <form onSubmit={handlePasswordChange} className="flex flex-col gap-6 max-w-md">
        {user.password && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-dark">Current Password</label>
            <Input name="currentPassword" type="password" required className="rounded-xl" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-dark">New Password</label>
          <Input name="newPassword" type="password" required className="rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-dark">Confirm New Password</label>
          <Input name="confirmPassword" type="password" required className="rounded-xl" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button type="submit" disabled={isChangingPassword} className="bg-text-dark hover:bg-black text-white rounded-xl px-8 font-semibold w-full sm:w-auto">
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>
          {passwordMessage && (
            <span className={`text-sm font-medium ${passwordMessage.includes("success") ? "text-green-600" : "text-red-500"}`}>
              {passwordMessage}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
