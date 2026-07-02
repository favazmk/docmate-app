import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CountryCardProps {
  flag: string;
  name: string;
  cities: string;
  href: string;
}

export default function CountryCard({ flag, name, cities, href }: CountryCardProps) {
  return (
    <Link href={href} className="group flex items-center justify-between p-6 rounded-xl border border-gray-border bg-white hover:border-blue-primary hover:bg-blue-light transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-light text-blue-primary font-bold text-sm">
          {flag}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-text-dark group-hover:text-blue-primary transition-colors">{name}</span>
          <span className="text-xs text-text-light">{cities}</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-border group-hover:text-blue-primary transition-colors" />
    </Link>
  );
}
