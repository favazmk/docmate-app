import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CountryCardProps {
  flag: string;
  name: string;
  cities: string;
  href: string;
  image: string;
}

export default function CountryCard({ flag, name, cities, href, image }: CountryCardProps) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-gray-border/60 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-blue-primary/30 hover:shadow-lg hover:shadow-blue-primary/8"
    >
      <Image
        src={image}
        alt={`${name} skyline`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/25 to-transparent" />

      <span className="absolute top-4 left-4 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-caption font-bold text-white backdrop-blur-md">
        {flag}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div className="flex flex-col">
          <span className="text-subheading font-bold text-white">{name}</span>
          <span className="text-secondary text-white/75">{cities}</span>
        </div>
        <ChevronRight className="mb-1 h-5 w-5 shrink-0 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
    </Link>
  );
}
