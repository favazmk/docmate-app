import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface SpecialtyCardProps {
  name: string;
  count: number;
  icon: LucideIcon;
  href: string;
  isViewAll?: boolean;
}

export default function SpecialtyCard({ name, count, icon: Icon, href, isViewAll }: SpecialtyCardProps) {
  if (isViewAll) {
    return (
      <Link href={href} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-blue-primary bg-blue-light text-blue-primary hover:bg-blue-primary hover:text-white transition-colors h-full">
        <span className="font-bold text-sm tracking-wide">View all {count} specialties</span>
      </Link>
    );
  }

  return (
    <Link href={href} className="flex flex-col items-start p-5 rounded-xl border border-gray-border bg-white hover:border-blue-primary transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center mb-4 text-blue-primary group-hover:bg-blue-primary group-hover:text-white transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-text-dark text-sm mb-1">{name}</h3>
      <p className="text-text-light text-[11px] font-medium tracking-wide uppercase">{count} Doctors</p>
    </Link>
  );
}
