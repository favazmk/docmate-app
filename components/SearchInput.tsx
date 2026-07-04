"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchInput({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("query", val);
    } else {
      params.delete("query");
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(value);
      }}
      className="relative w-full max-w-md"
    >
      <Search className="w-4 h-4 absolute left-3 top-3.5 text-text-light pointer-events-none" />
      <input
        type="text"
        placeholder="Search doctor by name or clinic..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => handleSearch(value)}
        className="w-full bg-white border border-gray-border rounded-xl h-11 pl-9 pr-8 text-sm font-medium focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            handleSearch("");
          }}
          className="absolute right-3 top-3.5 text-text-light hover:text-text-dark"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
