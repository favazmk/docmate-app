"use client";

import { useState } from "react";

export default function DoctorAboutSection({ bio }: { bio: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;

  if (bio.length <= maxLength) {
    return (
      <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-text-dark mb-4">About the Doctor</h3>
        <p className="text-text-mid leading-relaxed whitespace-pre-line">{bio}</p>
      </div>
    );
  }

  const displayedText = isExpanded ? bio : `${bio.substring(0, maxLength)}...`;

  return (
    <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="text-xl font-bold text-text-dark mb-4">About the Doctor</h3>
      <p className="text-text-mid leading-relaxed whitespace-pre-line transition-all duration-200">
        {displayedText}
      </p>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 text-sm font-bold text-blue-primary hover:text-blue-hover hover:underline focus:outline-none"
      >
        {isExpanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}
