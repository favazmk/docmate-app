"use client";

import { useState } from "react";
import Image from "next/image";

interface PhotoGalleryProps {
  photoUrls: string[];
  name: string;
  size?: "hero" | "compact" | "branch";
  maxThumbnails?: number;
  fallbackIcon?: React.ReactNode;
}

const SIZE_CLASSES = {
  hero: {
    main: "w-24 h-24 md:w-32 md:h-32 rounded-3xl",
    thumb: "w-8 h-8 md:w-10 md:h-10 rounded-lg",
    defaultMaxThumbnails: 4,
    layout: "stacked",
  },
  compact: {
    main: "w-20 h-20 rounded-2xl",
    thumb: "w-6 h-6 rounded-md",
    defaultMaxThumbnails: 3,
    layout: "stacked",
  },
  branch: {
    main: "w-full sm:w-72 h-52 rounded-2xl",
    thumb: "w-16 h-16 rounded-xl",
    defaultMaxThumbnails: 6,
    layout: "side",
  },
} as const;

export default function PhotoGallery({
  photoUrls,
  name,
  size = "compact",
  maxThumbnails,
  fallbackIcon,
}: PhotoGalleryProps) {
  const [activePhoto, setActivePhoto] = useState(photoUrls[0]);
  const classes = SIZE_CLASSES[size];
  const limit = maxThumbnails ?? classes.defaultMaxThumbnails;

  if (photoUrls.length === 0) {
    return (
      <div className={`relative ${classes.main} overflow-hidden border border-gray-border bg-gray-50 flex items-center justify-center shrink-0`}>
        {fallbackIcon}
      </div>
    );
  }

  // Filter out the active photo so we don't show it twice
  const remainingPhotos = photoUrls.filter(url => url !== activePhoto);

  // Reserve the last thumbnail slot for a "+N" overflow tile once there isn't
  // room to show every photo as its own plain thumbnail.
  const fitsWithoutOverflow = remainingPhotos.length <= limit;
  const normalThumbCount = fitsWithoutOverflow ? remainingPhotos.length : Math.max(0, limit - 1);
  const visibleThumbnails = remainingPhotos.slice(0, normalThumbCount + (fitsWithoutOverflow ? 0 : 1));
  const overflowCount = remainingPhotos.length - normalThumbCount;

  const isSide = classes.layout === "side";
  
  // If exactly 3 images, show 2 large thumbnails (3 big total). Otherwise show 1 large thumbnail (2 big total).
  const numLargeThumbnails = photoUrls.length === 3 ? 2 : 1;

  return (
    <div className={`flex ${isSide ? "flex-row w-full" : "flex-col shrink-0"} gap-2`}>
      <div className={`relative ${classes.main} overflow-hidden border border-gray-border bg-gray-50 shrink-0`}>
        <Image src={activePhoto} alt={name} fill className="object-cover" />
      </div>

      {remainingPhotos.length > 0 && (
        <div className={`flex ${isSide ? "flex-row flex-wrap content-start flex-1" : "flex-row"} gap-2`}>
          {visibleThumbnails.map((url, i) => {
            const isOverflowTile = !fitsWithoutOverflow && i === visibleThumbnails.length - 1;

            return (
              <button
                type="button"
                key={url}
                onClick={() => setActivePhoto(url)}
                className={`relative ${isSide && i < numLargeThumbnails ? classes.main : classes.thumb} overflow-hidden border-2 shrink-0 transition-all ${
                  activePhoto === url ? "border-blue-primary scale-105" : "border-gray-border hover:border-text-mid"
                }`}
              >
                <Image src={url} alt={`${name} photo ${i + 1}`} fill className="object-cover" />
                {isOverflowTile && (
                  <span className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold flex items-center justify-center">
                    +{overflowCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
