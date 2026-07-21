"use client";

import { useState } from "react";
import { updateAppointmentStatus } from "@/app/actions/admin";

interface Props {
  appointmentId: string;
  initialStatus: string;
}

export default function AdminAppointmentStatusSelect({ appointmentId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
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
    'bg-red-50 text-red-600';

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isLoading}
        className={`appearance-none cursor-pointer pl-3 pr-8 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider outline-none border-none focus:ring-2 focus:ring-blue-primary/50 transition-colors ${statusColor} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="PENDING" className="bg-white text-text-dark">PENDING</option>
        <option value="CONFIRMED" className="bg-white text-text-dark">CONFIRMED</option>
        <option value="CANCELLED" className="bg-white text-text-dark">CANCELLED</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}
