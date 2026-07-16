import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface SpecialtyCardProps {
  name: string;
  count: number;
  icon: LucideIcon;
  href: string;
  isViewAll?: boolean;
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  "gynecology": { bg: "bg-pink-50 hover:bg-pink-100/70", text: "text-pink-600", border: "border-pink-200/50" },
  "cardiology": { bg: "bg-rose-50 hover:bg-rose-100/70", text: "text-rose-600", border: "border-rose-200/50" },
  "ophthalmology": { bg: "bg-blue-50 hover:bg-blue-100/70", text: "text-blue-600", border: "border-blue-200/50" },
  "orthopedics": { bg: "bg-amber-50 hover:bg-amber-100/70", text: "text-amber-600", border: "border-amber-200/50" },
  "pediatrics": { bg: "bg-purple-50 hover:bg-purple-100/70", text: "text-purple-600", border: "border-purple-200/50" },
  "neurology": { bg: "bg-indigo-50 hover:bg-indigo-100/70", text: "text-indigo-600", border: "border-indigo-200/50" },
  "pulmonology": { bg: "bg-teal-50 hover:bg-teal-100/70", text: "text-teal-600", border: "border-teal-200/50" },
  "gastroenterology": { bg: "bg-emerald-50 hover:bg-emerald-100/70", text: "text-emerald-600", border: "border-emerald-200/50" },
  "endocrinology": { bg: "bg-orange-50 hover:bg-orange-100/70", text: "text-orange-600", border: "border-orange-200/50" },
  "dermatology": { bg: "bg-cyan-50 hover:bg-cyan-100/70", text: "text-cyan-600", border: "border-cyan-200/50" },
};

export default function SpecialtyCard({ name, count, icon: Icon, href, isViewAll }: SpecialtyCardProps) {
  if (isViewAll) {
    return (
      <Link href={href} className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-blue-primary/30 bg-blue-primary/8 text-blue-primary hover:bg-blue-primary hover:text-white transition-[background-color,color,transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-primary/15 h-full">
        <span className="font-bold text-sm tracking-wide">View all {count} specialties</span>
      </Link>
    );
  }

  const colors = colorMap[name.toLowerCase()] || {
    bg: "bg-blue-50 hover:bg-blue-100/70",
    text: "text-blue-600",
    border: "border-blue-100"
  };

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${colors.border} ${colors.bg} transition-all duration-300 group text-center shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]`}
    >
      <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3.5 shadow-sm ${colors.text} group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-text-dark text-sm leading-tight group-hover:translate-y-[-2px] transition-transform duration-300">{name}</h3>
    </Link>
  );
}
