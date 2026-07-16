"use client";

import { useState } from "react";
import { getAppointmentsByEmailAndPhone } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, Calendar, Clock, MapPin, User, Search, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TrackBookingPage() {
  const [email, setEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+971");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) {
      setErrorMsg("Please fill out both email and phone number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSearched(false);

    try {
      const fullPhone = `${phonePrefix} ${phone.trim()}`;
      const res = await getAppointmentsByEmailAndPhone(email, fullPhone);
      if (res.success) {
        setAppointments(res.appointments || []);
        setSearched(true);
      } else {
        setErrorMsg(res.error || "An error occurred while tracking bookings.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-text-dark tracking-tight sm:text-4xl">
            Track Your Appointments
          </h1>
          <p className="mt-3 text-lg text-text-mid max-w-xl mx-auto">
            Retrieve your booking status and history instantly without signing in.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl border border-gray-border p-6 md:p-8 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-5 items-end">
            <div className="flex-1 w-full flex flex-col gap-2">
              <label className="text-sm font-bold text-text-dark flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-primary" /> Email Address
              </label>
              <input
                type="email"
                required
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary"
              />
            </div>

            <div className="flex-1 w-full flex flex-col gap-2">
              <label className="text-sm font-bold text-text-dark flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-blue-primary" /> Phone Number
              </label>
              <div className="flex">
                <select
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  className="bg-gray-bg border border-gray-border border-r-0 rounded-l-xl h-12 px-3 text-sm font-medium text-text-dark focus:outline-none"
                >
                  <option>+971</option>
                  <option>+966</option>
                  <option>+965</option>
                </select>
                <input
                  type="tel"
                  required
                  placeholder="50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-bg border border-gray-border rounded-r-xl h-12 px-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-blue-primary hover:bg-blue-hover text-white h-12 px-8 rounded-xl font-bold flex items-center justify-center gap-2 shrink-0 shadow-md shadow-blue-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find Bookings
                </>
              )}
            </Button>
          </form>

          {errorMsg && (
            <div className="mt-4 bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 text-sm font-medium">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Results Section */}
        {searched && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-text-dark mb-6">
              Found {appointments.length} Appointment{appointments.length !== 1 ? "s" : ""}
            </h2>

            {appointments.length === 0 ? (
              <div className="bg-white border border-gray-border rounded-3xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-light text-blue-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mb-2">No Appointments Found</h3>
                <p className="text-text-mid max-w-sm mx-auto mb-6">
                  Double check your email and phone number prefix, or ensure the details match the ones entered during booking.
                </p>
                <button
                  onClick={() => {
                    setEmail("");
                    setPhone("");
                    setSearched(false);
                  }}
                  className="text-blue-primary font-bold hover:underline inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Try another search
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white border border-gray-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-bg border border-gray-border shrink-0">
                        <Image
                          src={apt.doctor.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor.name)}&background=2200CC&color=fff`}
                          alt={apt.doctor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-light uppercase tracking-wider">
                            ID: {apt.id.substring(0, 8).toUpperCase()}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              apt.status === "CONFIRMED"
                                ? "bg-green-badge-bg text-green-badge"
                                : apt.status === "PENDING"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-text-dark leading-tight">
                          {apt.doctor.name}
                        </h3>
                        <p className="text-sm font-medium text-blue-primary">
                          {apt.doctor.specialty}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-text-mid font-medium">
                          <MapPin className="w-3.5 h-3.5 text-text-light" /> {apt.doctor.affiliation}, {apt.doctor.city}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-border shrink-0 text-left md:text-right md:items-end justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 md:justify-end text-sm text-text-dark font-bold">
                          <Calendar className="w-4 h-4 text-blue-primary" /> {apt.date}
                        </div>
                        {!apt.timeSlot.toLowerCase().includes("pending") && (
                          <div className="flex items-center gap-2 md:justify-end text-xs text-text-mid font-medium">
                            <Clock className="w-4 h-4 text-text-light" /> {apt.timeSlot}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-text-light font-semibold uppercase tracking-wider block">Patient</span>
                        <span className="text-xs font-bold text-text-dark flex items-center gap-1">
                          <User className="w-3 h-3 text-text-light" /> {apt.patientName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
