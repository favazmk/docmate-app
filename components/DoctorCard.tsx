import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface DoctorCardProps {
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  city: string;
  countryFlag: string;
  languages: string[];
  fee: number;
  currency: string;
  photoUrl: string;
  isVerified: boolean;
}

export default function DoctorCard({
  slug,
  name,
  specialty,
  rating,
  reviews,
  city,
  countryFlag,
  languages,
  fee,
  currency,
  photoUrl,
  isVerified
}: DoctorCardProps) {
  return (
    <div className="bg-white border border-gray-border rounded-xl p-5 flex flex-col hover:border-blue-primary/50 transition-colors">
      <div className="flex gap-4 mb-4">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-bg border border-gray-border">
          <Image src={photoUrl} alt={name} fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <Link href={`/doctors/${slug}`} className="font-bold text-text-dark text-lg hover:text-blue-primary flex items-center gap-1.5 transition-colors">
            {name}
            {isVerified && <BadgeCheck className="w-4 h-4 text-green-badge" />}
          </Link>
          <span className="text-sm font-medium text-blue-primary">{specialty}</span>
          
          <div className="flex items-center gap-1.5 mt-1">
            <Star className="w-3.5 h-3.5 text-star-color fill-star-color" />
            <span className="text-xs font-semibold text-text-dark">{rating.toFixed(1)}</span>
            <span className="text-xs text-text-light">({reviews})</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-5 text-sm text-text-mid">
        <div className="flex items-center gap-2">
          <span>{countryFlag}</span>
          <span>{city}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {languages.map(lang => (
            <Badge key={lang} variant="secondary" className="bg-gray-bg text-text-mid font-medium text-[10px] uppercase tracking-wider hover:bg-gray-border">
              {lang}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-border flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-light">Consultation</span>
          <span className="font-bold text-text-dark text-sm">{currency} {fee}</span>
        </div>
        <Button asChild size="sm" className="bg-blue-primary hover:bg-blue-hover text-white rounded-lg h-9 px-4 text-xs">
          <Link href={`/book/${slug}`}>Book Now</Link>
        </Button>
      </div>
    </div>
  );
}
