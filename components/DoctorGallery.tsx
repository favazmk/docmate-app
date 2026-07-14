"use client";

import { useState } from "react";
import Image from "next/image";

interface DoctorGalleryProps {
  photoUrls: string[];
  name: string;
}

export default function DoctorGallery({ photoUrls, name }: DoctorGalleryProps) {
  const defaultPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2200CC&color=fff`;
  const [activePhoto, setActivePhoto] = useState(photoUrls[0] || defaultPlaceholder);

  return (
    <div className="flex flex-col gap-3 shrink-0">
      {/* Active Photo Display */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-gray-border bg-gray-bg shadow-sm">
        <Image src={activePhoto} alt={name} fill className="object-cover" />
      </div>
      
      {/* Thumbnails Row */}
      {photoUrls.length > 1 && (
        <div className="flex gap-2 max-w-[128px] md:max-w-[160px] overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-gray-200">
          {photoUrls.map((url, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActivePhoto(url)}
              className={`relative w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                activePhoto === url 
                  ? "border-blue-primary scale-105 shadow-sm" 
                  : "border-gray-border hover:border-text-mid"
              }`}
            >
              <Image src={url} alt={`${name} gallery ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
