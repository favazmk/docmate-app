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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);

    // Scroll spy for homepage sections
    let observer: IntersectionObserver;
    if (pathname === "/") {
      const sections = ["specialties", "cities"];
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
    { label: "About Us", href: "/about" },
    { label: "Find doctors", href: "/search" },
    { label: "Specialties", href: "/#specialties" },
    { label: "Cities", href: "/#cities" },
    { label: "Blog", href: "/blog" },
  ];

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={`h-[56px] sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-gray-border/60 shadow-[0_4px_24px_rgba(26,18,100,0.06)]"
          : "bg-white border-gray-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 w-full h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Doc Mate Logo" width={110} height={32} className="object-contain" priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center bg-white rounded-full p-1.5 shadow-md border border-gray-border">
            {navLinks.map((link) => {
              const isActive = checkActive(link.href);
              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className={`text-sm font-medium transition-colors px-5 py-2 rounded-full ${
                    isActive 
                      ? "bg-blue-primary text-white font-bold shadow-sm" 
                      : "text-text-mid hover:text-blue-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/list-your-clinic" 
            className={`text-sm font-medium transition-colors ${
              pathname === "/list-your-clinic"
                ? "text-blue-primary font-bold"
                : "text-blue-primary hover:text-blue-hover"
            }`}
          >
            List your clinic
          </Link>
          
          {status === "loading" ? (
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-full"></div>
          ) : session ? (
            <Link href="/dashboard">
              <Button className="bg-blue-primary hover:bg-blue-hover text-white rounded-full">Profile</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="bg-blue-primary hover:bg-blue-hover text-white rounded-full">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="p-2 hover:bg-gray-100 rounded-md inline-flex items-center justify-center" onClick={() => setIsOpen(true)}>
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
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors ${isActive ? "text-blue-primary font-bold" : "text-text-dark hover:text-blue-primary"}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="h-px bg-gray-border w-full"></div>
                <Link 
                  href="/list-your-clinic" 
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    pathname === "/list-your-clinic" ? "text-blue-primary font-bold" : "text-blue-primary"
                  }`}
                >
                  List your clinic
                </Link>

                {status === "loading" ? (
                  <div className="h-10 w-full bg-gray-100 animate-pulse rounded-lg"></div>
                ) : session ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="bg-blue-primary hover:bg-blue-hover text-white rounded-lg w-full">Profile</Button>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
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
