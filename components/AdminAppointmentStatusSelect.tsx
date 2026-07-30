"use client";

import { useState } from "react";
import { updateAppointmentStatus } from "@/app/actions/admin";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { AppointmentStatus } from "@prisma/client";

interface Props {
  appointmentId: string;
  initialStatus: AppointmentStatus | string;
}

export default function AdminAppointmentStatusSelect({ appointmentId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (val: string) => {
    const newStatus = val as AppointmentStatus;
    setStatus(newStatus);
    setIsLoading(true);
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert on error
      setStatus(initialStatus);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColor = 
    status === 'CONFIRMED' ? 'bg-green-badge-bg text-green-badge' :
    status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
    status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' :
    status === 'RESCHEDULED' ? 'bg-purple-50 text-purple-600' :
    'bg-red-50 text-red-600';

  return (
    <div className={`relative inline-block w-[140px] ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <CustomDropdown
        value={status}
        onChange={handleStatusChange}
        options={[
          { value: "PENDING", label: "PENDING" },
          { value: "CONFIRMED", label: "CONFIRMED" },
          { value: "CANCELLED", label: "CANCELLED" },
          { value: "COMPLETED", label: "COMPLETED" },
          { value: "RESCHEDULED", label: "RESCHEDULED" }
        ]}
        placeholder="Status"
      />
    </div>
  );
}
