"use client";

import { useState, useEffect } from "react";
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
import { useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const { data: session, status } = useSession();
  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);

    // Scroll spy for homepage sections
    let observer: IntersectionObserver;
    if (pathname === "/") {
      const sections = ["specialties", "areas"];
      const elements = sections.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
      
      const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -50% 0px", // Trigger when the section takes up the middle of the screen
        threshold: 0,
      };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      };

      observer = new IntersectionObserver(observerCallback, observerOptions);
      elements.forEach((el) => observer.observe(el));

      const handleScroll = () => {
        if (window.scrollY < 100) {
          setActiveHash("");
        }
      };
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("hashchange", handleHashChange);
        window.removeEventListener("scroll", handleScroll);
        if (observer) {
          elements.forEach((el) => observer.unobserve(el));
        }
      };
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  const checkActive = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.substring(1);
      return pathname === "/" && activeHash === hash;
    }
    if (href === "/search") {
      return (
        pathname === "/search" ||
        pathname.startsWith("/search/") ||
        pathname.startsWith("/doctors/") ||
        pathname.startsWith("/book/") ||
        /^\/[a-zA-Z]{2}(\/|$)/.test(pathname)
      );
    }
    if (href === "/blog") {
      return pathname === "/blog" || pathname.startsWith("/blog/");
    }
    return pathname === href;
  };

  const navLinks = [
    { label: "Find doctors", href: "/search" },
    { label: "Specialties", href: "/#specialties" },
    { label: "Areas", href: "/#areas" },
    { label: "Blog", href: "/blog" },
  ];

  if (pathname?.startsWith("/admin")) return null;

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
            const isActive = checkActive(link.href);
            return (
              <Link 
                key={link.label} 
                href={link.href} 
                className={`text-sm font-medium transition-colors ${isActive ? "text-blue-primary font-bold border-b-2 border-blue-primary pb-1" : "text-text-mid hover:text-blue-primary"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="w-px h-6 bg-gray-border mx-2"></div>
          <Link 
            href="/list-your-clinic" 
            className={`text-sm font-medium transition-colors ${
              pathname === "/list-your-clinic"
                ? "text-blue-primary font-bold border-b-2 border-blue-primary pb-1"
                : "text-blue-primary hover:text-blue-hover"
            }`}
          >
            List your clinic
          </Link>
          
          {status === "loading" ? (
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-lg"></div>
          ) : session ? (
            <Link href="/dashboard">
              <Button className="bg-blue-primary hover:bg-blue-hover text-white rounded-lg">Profile</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="bg-blue-primary hover:bg-blue-hover text-white rounded-lg">Sign In</Button>
            </Link>
          )}
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
                  const isActive = checkActive(link.href);
                  return (
                    <Link 
                      key={link.label} 
                      href={link.href} 
                      className={`text-lg font-medium transition-colors ${isActive ? "text-blue-primary font-bold" : "text-text-dark hover:text-blue-primary"}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="h-px bg-gray-border w-full"></div>
                <Link 
                  href="/list-your-clinic" 
                  className={`text-lg font-medium transition-colors ${
                    pathname === "/list-your-clinic" ? "text-blue-primary font-bold" : "text-blue-primary"
                  }`}
                >
                  List your clinic
                </Link>

                {status === "loading" ? (
                  <div className="h-10 w-full bg-gray-100 animate-pulse rounded-lg"></div>
                ) : session ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-primary hover:bg-blue-hover text-white rounded-lg w-full">Profile</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button className="bg-blue-primary hover:bg-blue-hover text-white rounded-lg w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
