"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Menu, Activity, Users, Calendar, Building2, MapPin, Stethoscope } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface AdminHeaderProps {
  title: string;
  badgeText?: string | number;
}

export default function AdminHeader({ title, badgeText }: AdminHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: Activity },
    { label: "Doctors", href: "/admin/doctors", icon: Users },
    { label: "Appointments", href: "/admin/appointments", icon: Calendar },
    { label: "Hospital Groups", href: "/admin/hospitals", icon: Building2 },
    { label: "Clinic Branches", href: "/admin/clinics", icon: MapPin },
    { label: "Specialties", href: "/admin/specialties", icon: Stethoscope },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-border px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden shrink-0">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="p-2 hover:bg-gray-100 rounded-md inline-flex items-center justify-center text-text-dark h-9 w-9">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
              <div className="h-16 flex items-center px-6 border-b border-gray-border">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <Image src="/logo.png" alt="Doc Mate Logo" width={110} height={32} className="object-contain" priority />
                </Link>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1.5">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
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
            </SheetContent>
          </Sheet>
        </div>

        <h1 className="font-bold text-text-dark text-base md:text-lg truncate">{title}</h1>
        {badgeText !== undefined && (
          <span className="bg-blue-light text-blue-primary text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0">
            {badgeText}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-light text-blue-primary flex items-center justify-center font-bold text-sm">
          A
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-text-mid hover:text-red-500 hover:bg-red-50 flex items-center gap-1.5 h-8 px-2 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-semibold hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
