"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Star, MapPin, Stethoscope, Building2 } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { Badge } from "./ui/badge";

interface DoctorCardProps {
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  city: string;
  languages: string[];
  photoUrl: string;
  isVerified: boolean;
  clinicName?: string;
  fee?: number;
  variant?: "grid" | "row";
}

export default function DoctorCard({
  slug,
  name,
  specialty,
  rating,
  reviews,
  city,
  languages,
  photoUrl,
  isVerified,
  clinicName,
  fee = 250,
  variant = "row"
}: DoctorCardProps) {
  const router = useRouter();
  
  const defaultPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2200CC&color=fff`;
  const firstPhoto = photoUrl ? photoUrl.split(',')[0] : defaultPlaceholder;

  if (variant === "grid") {
    return (
      <div 
        onClick={() => router.push(`/doctors/${slug}`)}
        className="bg-white/85 border border-gray-border/60 rounded-2xl flex flex-col hover:border-blue-primary/40 hover:shadow-xl hover:shadow-blue-primary/8 transition-[border-color,box-shadow,transform] duration-300 cursor-pointer overflow-hidden group h-full card-hover"
      >
        {/* Large Image Container */}
        <div className="relative w-full h-64 bg-gray-bg border-b border-gray-border">
          <Image src={firstPhoto} alt={name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          <div className="absolute top-4 left-4">
            <span className="bg-blue-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Featured
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 flex flex-col flex-1">
          <span className="text-xs font-bold text-blue-primary uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5" /> {specialty}
          </span>
          
          <h3 className="font-extrabold text-text-dark text-lg hover:text-blue-primary flex items-center gap-1.5 transition-colors mb-1.5">
            {name}
            {isVerified && <BadgeCheck className="w-5 h-5 text-green-badge shrink-0" />}
          </h3>

          {/* Clinic & City details */}
          {clinicName && (
            <p className="text-xs font-bold text-text-mid mb-1 line-clamp-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 shrink-0" /> {clinicName}
            </p>
          )}

          <div className="flex items-center gap-1.5 mb-4 text-xs text-text-light font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-primary" />
            <span>{city}</span>
          </div>

          <div className="flex items-center gap-1.5 mb-4" title="Ratings are read-only placeholder">
            <Star className="w-4 h-4 text-star-color fill-star-color" />
            <span className="text-sm font-bold text-text-dark">{rating.toFixed(1)}</span>
            <span className="text-xs text-text-light">({reviews} reviews)</span>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-1.5 flex-wrap mb-6">
            {languages.slice(0, 3).map(lang => (
              <Badge key={lang} variant="secondary" className="bg-gray-bg text-text-mid font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md hover:bg-gray-border">
                {lang}
              </Badge>
            ))}
          </div>

          {/* Pricing & CTA */}
          <div className="mt-auto pt-4 border-t border-gray-border">
            <Link 
              href={`/book/${slug}`} 
              onClick={(e) => e.stopPropagation()}
              className={`${buttonVariants({ size: "sm" })} bg-blue-primary hover:bg-blue-hover text-white rounded-xl h-10 w-full font-bold shadow-md shadow-blue-primary/10 transition-all flex items-center justify-center`}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Doctify Wide Row style (variant === "row")
  return (
    <div 
      onClick={() => router.push(`/doctors/${slug}`)}
      className="bg-white/85 border border-gray-border/60 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-blue-primary/40 hover:shadow-xl hover:shadow-blue-primary/8 transition-[border-color,box-shadow,transform] duration-300 cursor-pointer card-hover"
    >
      {/* Left Column - Doctor Photo */}
      <div className="relative w-full md:w-40 h-44 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-border">
        <Image src={firstPhoto} alt={name} fill sizes="(max-width: 768px) 100vw, 160px" className="object-cover" />
      </div>

      {/* Middle Column - Doctor Details */}
      <div className="flex-grow flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-blue-primary uppercase tracking-wide flex items-center gap-1 mb-1">
            <Stethoscope className="w-3.5 h-3.5" /> {specialty}
          </span>
          <Link 
            href={`/doctors/${slug}`} 
            onClick={(e) => e.stopPropagation()}
            className="font-extrabold text-text-dark text-xl hover:text-blue-primary flex items-center gap-1.5 transition-colors"
          >
            {name}
            {isVerified && <BadgeCheck className="w-5 h-5 text-green-badge shrink-0" />}
          </Link>
        </div>

        {clinicName && (
          <div className="text-sm font-semibold text-text-dark flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-primary shrink-0" />
            <span>{clinicName}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-text-light font-medium">
          <MapPin className="w-4 h-4 text-blue-primary shrink-0" />
          <span>{city}</span>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          {languages.map(lang => (
            <Badge key={lang} variant="secondary" className="bg-gray-bg text-text-mid font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
              {lang}
            </Badge>
          ))}
        </div>
      </div>

      {/* Right Column - Ratings, Fee & Booking */}
      <div className="w-full md:w-52 shrink-0 flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-gray-border pt-4 md:pt-0 md:pl-6">
        {/* Rating Block */}
        <div className="flex flex-col md:items-end gap-1.5" title="Ratings are read-only placeholder">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-star-color fill-star-color" />
            <span className="text-base font-bold text-text-dark">{rating.toFixed(1)}</span>
            <span className="text-xs text-text-light">({reviews} reviews)</span>
          </div>
          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
            Patient Choice
          </span>
        </div>



        {/* Actions */}
        <div className="w-full flex gap-3 mt-4 md:mt-0">
          <Link 
            href={`/doctors/${slug}`}
            onClick={(e) => e.stopPropagation()}
            className={`${buttonVariants({ size: "sm", variant: "outline" })} flex-1 border-gray-border text-text-dark hover:bg-gray-bg rounded-xl h-10 text-xs font-bold`}
          >
            Profile
          </Link>
          <Link 
            href={`/book/${slug}`} 
            onClick={(e) => e.stopPropagation()}
            className={`${buttonVariants({ size: "sm" })} flex-1 bg-blue-primary hover:bg-blue-hover text-white rounded-xl h-10 text-xs font-bold shadow-md shadow-blue-primary/10`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
