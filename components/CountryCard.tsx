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
    <Link href={href} className="group flex items-center justify-between p-6 rounded-xl border border-gray-border/60 bg-white/85 hover:border-blue-primary/30 transition-[border-color,box-shadow,transform,background-color] duration-300 hover:shadow-lg hover:shadow-blue-primary/6 hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-light/60 text-blue-primary font-bold text-sm group-hover:scale-110 group-hover:bg-blue-primary group-hover:text-white transition-all duration-300">
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
