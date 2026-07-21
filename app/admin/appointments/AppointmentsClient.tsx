"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import AdminAppointmentStatusSelect from "@/components/AdminAppointmentStatusSelect";
import { Download, Search, SlidersHorizontal, X, User } from "lucide-react";
import * as XLSX from 'xlsx';

export default function AppointmentsClient({ appointments }: { appointments: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("ALL");
  const [clinicFilter, setClinicFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST"); // NEWEST or OLDEST

  // Extract unique hospitals and clinics for filters
  const uniqueHospitals = useMemo(() => {
    const hospitals = new Set<string>();
    appointments.forEach(apt => {
      const hg = apt.doctor?.clinic?.hospitalGroup?.name;
      if (hg) hospitals.add(hg);
    });
    return Array.from(hospitals).sort();
  }, [appointments]);

  const uniqueClinics = useMemo(() => {
    const clinics = new Set<string>();
    appointments.forEach(apt => {
      // Only include clinics that match the selected hospital group (if any)
      if (hospitalFilter !== "ALL" && apt.doctor?.clinic?.hospitalGroup?.name !== hospitalFilter) {
        return;
      }
      const clinicName = apt.doctor?.clinic?.name;
      if (clinicName) clinics.add(clinicName);
    });
    return Array.from(clinics).sort();
  }, [appointments, hospitalFilter]);

  const filteredAndSorted = useMemo(() => {
    const result = appointments.filter(apt => {
      const bookingId = apt.id.substring(0, 8).toLowerCase();
      const matchSearch = (
        bookingId.includes(searchTerm.toLowerCase()) ||
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.doctor?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.doctor?.clinic?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchStatus = statusFilter === "ALL" || apt.status === statusFilter;
      const matchDate = (!fromDate || apt.date >= fromDate) && (!toDate || apt.date <= toDate);
      const matchHospital = hospitalFilter === "ALL" || apt.doctor?.clinic?.hospitalGroup?.name === hospitalFilter;
      const matchClinic = clinicFilter === "ALL" || apt.doctor?.clinic?.name === clinicFilter;
      
      return matchSearch && matchStatus && matchDate && matchHospital && matchClinic;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [appointments, searchTerm, statusFilter, fromDate, toDate, hospitalFilter, clinicFilter, sortOrder]);

  const handleExport = () => {
    const dataToExport = filteredAndSorted.map(apt => ({
      "Booking ID": apt.id.substring(0, 8).toUpperCase(),
      "Patient Name": apt.patientName,
      "Patient Phone": apt.patientPhone,
      "Patient Email": apt.patientEmail,
      "Doctor Name": apt.doctor?.name || "Unknown",
      "Clinic": apt.doctor?.clinic?.name || "Unknown",
      "Date": apt.date,
      "Time": apt.timeSlot && apt.timeSlot !== "Pending Phone Call" ? apt.timeSlot : "",
      "Status": apt.status,
      "Booked At": new Date(apt.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
    XLSX.writeFile(workbook, "Appointments_Report.xlsx");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-dark">All Bookings</h2>
          <p className="text-sm text-text-mid mt-1">Review all appointments scheduled through the platform.</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Export to Excel
        </button>
      </div>

      <div className="bg-white border border-gray-border rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
        {/* Top Row: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-text-light" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-border rounded-xl bg-gray-bg focus:outline-none focus:border-blue-primary text-sm font-medium text-text-dark"
              placeholder="Search booking ID, patient, doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-text-light hidden md:block" />
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="block w-full md:w-auto py-2 px-3 border border-gray-border rounded-xl bg-gray-bg focus:outline-none focus:border-blue-primary text-sm font-semibold text-text-dark"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>
        </div>
        
        {/* Secondary filters row */}
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-start border-t border-gray-border pt-4">
          
          <div className="flex items-center gap-2 bg-gray-bg border border-gray-border rounded-xl px-2 w-full xl:w-auto shrink-0 overflow-x-auto">
            <span className="text-xs text-text-light font-semibold pl-2">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent py-2 px-1 focus:outline-none text-sm font-semibold text-text-dark"
            />
            <span className="text-xs text-text-light font-semibold">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent py-2 px-1 focus:outline-none text-sm font-semibold text-text-dark"
            />
            <select
              onChange={(e) => {
                const preset = e.target.value;
                const today = new Date();
                const from = new Date();
                
                if (preset === "ALL") {
                  setFromDate("");
                  setToDate("");
                } else {
                  if (preset === "TODAY") {
                    // today is already handled
                  } else if (preset === "7DAYS") {
                    from.setDate(today.getDate() - 7);
                  } else if (preset === "1MONTH") {
                    from.setMonth(today.getMonth() - 1);
                  } else if (preset === "3MONTHS") {
                    from.setMonth(today.getMonth() - 3);
                  }
                  // Format dates to YYYY-MM-DD
                  const formatDate = (d: Date) => d.toISOString().split('T')[0];
                  setFromDate(formatDate(from));
                  setToDate(formatDate(today));
                }
                e.target.value = ""; // Reset select after applying
              }}
              className="bg-transparent border-l border-gray-border py-2 pl-2 pr-4 focus:outline-none text-sm font-semibold text-blue-primary cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>Presets...</option>
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="7DAYS">Last 7 Days</option>
              <option value="1MONTH">Last 1 Month</option>
              <option value="3MONTHS">Last 3 Months</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 w-full xl:w-auto">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block flex-1 md:flex-none py-2 px-3 border border-gray-border rounded-xl bg-gray-bg focus:outline-none focus:border-blue-primary text-sm font-semibold text-text-dark"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
              <option value="RESCHEDULED">Rescheduled</option>
            </select>
            
            <select 
              value={hospitalFilter} 
              onChange={(e) => {
                setHospitalFilter(e.target.value);
                setClinicFilter("ALL"); // Reset clinic filter when hospital changes
              }}
              className="block flex-1 md:flex-none py-2 px-3 border border-gray-border rounded-xl bg-gray-bg focus:outline-none focus:border-blue-primary text-sm font-semibold text-text-dark"
            >
              <option value="ALL">All Hospitals / Groups</option>
              {uniqueHospitals.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>

            <select 
              value={clinicFilter} 
              onChange={(e) => setClinicFilter(e.target.value)}
              className="block flex-1 md:flex-none py-2 px-3 border border-gray-border rounded-xl bg-gray-bg focus:outline-none focus:border-blue-primary text-sm font-semibold text-text-dark"
            >
              <option value="ALL">All Clinics</option>
              {uniqueClinics.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-text-light uppercase tracking-wider font-semibold text-xs border-b border-gray-border">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Clinic</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-border">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-mid font-medium">No appointments found.</td>
                </tr>
              ) : filteredAndSorted.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-dark">{apt.id.substring(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 font-bold text-text-dark flex items-center gap-2">
                    {apt.patientName}
                    {apt.user && (
                      <button 
                        onClick={() => setSelectedUser(apt.user)}
                        className="text-blue-primary hover:bg-blue-light p-1 rounded-full transition-colors"
                        title="View Profile"
                      >
                        <User className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-text-mid">{apt.patientPhone}</td>
                  <td className="px-6 py-4 font-bold text-text-dark">{apt.doctor?.name || "Unknown"}</td>
                  <td className="px-6 py-4 text-text-mid font-medium">{apt.doctor?.clinic?.name || "Unknown"}</td>
                  <td className="px-6 py-4 text-text-mid font-medium">
                    {apt.date}
                    {apt.timeSlot && apt.timeSlot !== "Pending Phone Call" && `, ${apt.timeSlot}`}
                  </td>
                  <td className="px-6 py-4">
                    <AdminAppointmentStatusSelect appointmentId={apt.id} initialStatus={apt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-border">
              <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                <User className="w-6 h-6 text-blue-primary" /> Patient Profile
              </h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                {selectedUser.photoUrl ? (
                  <Image src={selectedUser.photoUrl} alt={selectedUser.name} width={64} height={64} className="rounded-full object-cover border border-gray-border" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-light text-blue-primary flex items-center justify-center font-bold text-xl border border-blue-primary/20">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-text-dark">{selectedUser.name}</h3>
                  <p className="text-sm font-medium text-text-mid">{selectedUser.email}</p>
                  {selectedUser.phone && <p className="text-sm font-medium text-text-mid">{selectedUser.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-border">
                  <span className="text-xs font-bold text-text-light uppercase tracking-wider block mb-1">Age</span>
                  <span className="font-semibold text-text-dark">{selectedUser.age || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-border">
                  <span className="text-xs font-bold text-text-light uppercase tracking-wider block mb-1">Blood Group</span>
                  <span className="font-semibold text-text-dark">{selectedUser.bloodGroup || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-border">
                  <span className="text-xs font-bold text-text-light uppercase tracking-wider block mb-1">Height</span>
                  <span className="font-semibold text-text-dark">{selectedUser.height || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-border">
                  <span className="text-xs font-bold text-text-light uppercase tracking-wider block mb-1">Weight</span>
                  <span className="font-semibold text-text-dark">{selectedUser.weight || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-border col-span-2">
                  <span className="text-xs font-bold text-text-light uppercase tracking-wider block mb-1">Insurance Provider</span>
                  <span className="font-semibold text-text-dark">{selectedUser.insuranceProvider || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-blue-light/30 p-4 rounded-xl border border-blue-primary/10">
                <span className="text-xs font-bold text-blue-primary uppercase tracking-wider block mb-2">Health Conditions & Concerns</span>
                <p className="text-sm font-medium text-text-dark whitespace-pre-wrap leading-relaxed">
                  {selectedUser.healthConditions || 'No conditions reported.'}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-border bg-gray-50 flex justify-end">
              <button onClick={() => setSelectedUser(null)} className="px-6 py-2 bg-white border border-gray-border rounded-xl font-bold text-text-dark hover:bg-gray-100 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
