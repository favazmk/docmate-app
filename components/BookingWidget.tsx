import { CalendarDays, MapPin } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";

interface BookingWidgetProps {
  slug: string;
  doctorName: string;
  clinicName: string;
  clinicPhone?: string;
}

export default function BookingWidget({ slug, doctorName, clinicName, clinicPhone = "+971 800 7777" }: BookingWidgetProps) {
  return (
    <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-lg shadow-gray-border/30 sticky top-8">
      <div className="mb-6">
        <h4 className="font-bold text-text-dark text-lg mb-2 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-primary" />
          Book Appointment
        </h4>
        <p className="text-sm text-text-mid leading-relaxed">
          Schedule your consultation with <span className="font-semibold text-text-dark">{doctorName}</span>. 
          Select your preferred date online, and a representative from <span className="font-semibold text-text-dark">{clinicName}</span> will contact you to finalize your slot.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href={`/book/${slug}`} className={`${buttonVariants()} w-full bg-blue-primary hover:bg-blue-hover text-white h-12 rounded-xl font-bold text-base shadow-md shadow-blue-primary/20`}>
          Book Appointment
        </Link>
        <p className="text-[11px] text-center text-text-light font-medium uppercase tracking-wider">Free online scheduling</p>
      </div>

      <hr className="my-6 border-gray-border" />

      <div className="flex flex-col gap-3">
        <a href={`tel:${clinicPhone}`} className="w-full">
          <Button variant="outline" className="w-full border-2 border-gray-border text-text-dark hover:bg-gray-bg h-11 rounded-xl font-semibold">
            Call Clinic
          </Button>
        </a>
        <div className="flex items-start gap-2 mt-2 text-xs text-text-mid">
          <MapPin className="w-4 h-4 shrink-0 text-text-light" />
          <p>{clinicName}, Dubai</p>
        </div>
      </div>
    </div>
  );
}
