"use client";

import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

export default function ExpandableText({ text, maxLength = 250 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  if (text.length <= maxLength) {
    return (
      <p className="text-sm text-text-dark leading-relaxed whitespace-pre-line">
        {text}
      </p>
    );
  }

  const displayText = isExpanded ? text : text.slice(0, maxLength) + "...";

  return (
    <div className="flex flex-col items-start gap-1">
      <p className="text-sm text-text-dark leading-relaxed whitespace-pre-line">
        {displayText}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm font-bold text-blue-primary hover:underline focus:outline-none"
      >
        {isExpanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}
