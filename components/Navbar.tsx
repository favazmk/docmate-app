"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const navLinks = [
    { label: "Find doctors", href: "/search" },
    { label: "Specialties", href: "/#specialties" },
    { label: "Countries", href: "/#countries" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="h-[56px] bg-white border-b border-gray-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 w-full h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Doc Mate Logo" width={110} height={32} className="object-contain" priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.label} 
                href={link.href} 
                className={`text-sm font-medium transition-colors ${isActive ? "text-blue-primary font-bold" : "text-text-mid hover:text-blue-primary"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="w-px h-6 bg-gray-border mx-2"></div>
          <Link href="/list-your-clinic" className="text-sm font-medium text-blue-primary hover:text-blue-hover transition-colors">
            List your clinic
          </Link>
          <Button className="bg-blue-primary hover:bg-blue-hover text-white rounded-lg">Sign In</Button>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="p-2 hover:bg-gray-100 rounded-md inline-flex items-center justify-center">
              <Menu className="w-5 h-5 text-text-dark" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.label} 
                      href={link.href} 
                      className={`text-lg font-medium transition-colors ${isActive ? "text-blue-primary font-bold" : "text-text-dark"}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="h-px bg-gray-border w-full"></div>
                <Link href="/list-your-clinic" className="text-lg font-medium text-blue-primary">
                  List your clinic
                </Link>
                <Button className="bg-blue-primary hover:bg-blue-hover text-white rounded-lg w-full">Sign In</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
