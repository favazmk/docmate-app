"use client";

import Link from "next/link";
import Image from "next/image";
import { Users, Activity, Calendar, Building2, Stethoscope, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: Activity },
    { label: "Doctors", href: "/admin/doctors", icon: Users },
    { label: "Appointments", href: "/admin/appointments", icon: Calendar },
    { label: "Hospital Groups", href: "/admin/hospitals", icon: Building2 },
    { label: "Clinic Branches", href: "/admin/clinics", icon: MapPin },
    { label: "Specialties", href: "/admin/specialties", icon: Stethoscope },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-white">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Doc Mate Logo" width={110} height={32} className="object-contain" priority />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                isActive
                  ? "bg-blue-primary text-white"
                  : "text-text-mid hover:bg-gray-100 hover:text-text-dark"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
