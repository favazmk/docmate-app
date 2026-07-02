import { CalendarDays, MapPin, Clock } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";



export default function BookingWidget({ slug }: { slug: string }) {
  // Mock available dates
  const dates = [
    { day: "Mon", date: "12", available: true },
    { day: "Tue", date: "13", available: true },
    { day: "Wed", date: "14", available: false },
    { day: "Thu", date: "15", available: true },
    { day: "Fri", date: "16", available: true },
  ];

  const times = ["09:00 AM", "09:30 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  return (
    <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-lg shadow-gray-border/30 sticky top-8">
      <div className="mb-6">
        <h4 className="font-semibold text-text-dark mb-3 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-primary" />
          Select a Date
        </h4>
        <div className="flex justify-between gap-2">
          {dates.map((d, i) => (
            <button
              key={i}
              disabled={!d.available}
              className={`flex flex-col items-center justify-center w-12 h-14 rounded-xl border ${
                !d.available 
                  ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed opacity-50" 
                  : i === 0 
                    ? "bg-blue-primary border-blue-primary text-white" 
                    : "bg-white border-gray-border text-text-dark hover:border-blue-primary hover:bg-blue-light/50"
              } transition-colors`}
            >
              <span className="text-[10px] uppercase font-semibold">{d.day}</span>
              <span className="text-lg font-bold leading-tight">{d.date}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-semibold text-text-dark mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-primary" />
          Select a Time
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {times.map((t, i) => (
            <button
              key={i}
              className={`py-2 px-1 text-xs font-semibold rounded-lg border ${
                i === 2 
                  ? "bg-blue-primary border-blue-primary text-white" 
                  : "bg-white border-gray-border text-text-mid hover:border-blue-primary hover:text-blue-primary"
              } transition-colors`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link href={`/book/${slug}`} className={`${buttonVariants()} w-full bg-blue-primary hover:bg-blue-hover text-white h-12 rounded-xl font-bold text-base shadow-md shadow-blue-primary/20`}>
          Book Appointment
        </Link>
        <p className="text-xs text-center text-text-light font-medium">Free cancellation up to 24 hours before</p>
      </div>

      <hr className="my-6 border-gray-border" />

      <div className="flex flex-col gap-3">
        <Button variant="outline" className="w-full border-2 border-gray-border text-text-dark hover:bg-gray-bg h-11 rounded-xl font-semibold">
          Call Clinic
        </Button>
        <div className="flex items-start gap-2 mt-2 text-xs text-text-mid">
          <MapPin className="w-4 h-4 shrink-0 text-text-light" />
          <p>Mediclinic City Hospital, Building 37, Dubai Healthcare City, Dubai</p>
        </div>
      </div>
    </div>
  );
}
