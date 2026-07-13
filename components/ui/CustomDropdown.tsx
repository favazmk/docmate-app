"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | Option)[];
  placeholder: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  labelPrefix?: string;
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  icon,
  labelPrefix
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { value, label }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return opt;
  });

  // Find active option label
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selector Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-gray-bg border border-gray-border rounded-xl px-4 py-3 text-left transition-all focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 select-none ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-primary/50 cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {icon && (
            <div className={`shrink-0 transition-colors ${disabled ? "text-text-light/40" : "text-blue-primary"}`}>
              {icon}
            </div>
          )}
          <div className="flex flex-col truncate">
            {labelPrefix && (
              <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 transition-colors ${
                disabled ? "text-text-light/40" : "text-blue-primary"
              }`}>
                {labelPrefix}
              </span>
            )}
            <span className={`text-sm font-semibold truncate transition-colors ${
              disabled ? "text-text-light/40" : value ? "text-text-dark" : "text-text-mid font-medium"
            }`}>
              {displayLabel}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-text-light shrink-0 transition-transform duration-250 ease-out ${
            isOpen ? "transform rotate-180 text-blue-primary" : ""
          }`}
        />
      </button>

      {/* Floating Menu List */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-border rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-[99] max-h-60 overflow-y-auto py-1.5 animate-in fade-in-50 slide-in-from-top-1 duration-150">
          {/* Default Option if not value */}
          <div
            onClick={() => handleSelect("")}
            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
              value === "" ? "bg-blue-light text-blue-primary font-bold" : "text-text-mid hover:bg-gray-bg hover:text-text-dark"
            }`}
          >
            {placeholder}
          </div>
          <div className="h-px bg-gray-border my-1"></div>

          {normalizedOptions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-text-light text-center">No options available</div>
          ) : (
            normalizedOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors truncate ${
                  value === opt.value
                    ? "bg-blue-light text-blue-primary font-bold"
                    : "text-text-dark hover:bg-gray-bg"
                }`}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
