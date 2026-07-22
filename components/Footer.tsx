"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-footer-bg text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpeg" alt="Doc Mate Logo" width={32} height={32} className="rounded-full" />
              <span className="font-bold text-lg tracking-tight">Docmate.</span>
            </Link>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              Doctor appointments made easy. Find and book trusted doctors in UAE instantly.
            </p>
          </div>

          {/* Platform Links */}
          <div className="col-span-1 flex flex-col gap-3">
            <h3 className="text-white/80 font-semibold mb-2">Platform</h3>
            <Link href="/search" className="text-white/50 hover:text-white transition-colors text-sm">Find a doctor</Link>
            <Link href="/hospitals" className="text-white/50 hover:text-white transition-colors text-sm">Hospitals</Link>
            <Link href="/#specialties" className="text-white/50 hover:text-white transition-colors text-sm">Specialties</Link>
            <Link href="/blog" className="text-white/50 hover:text-white transition-colors text-sm">Health blog</Link>
            <Link href="/track" className="text-white/50 hover:text-white transition-colors text-sm">Track appointment</Link>
          </div>

          {/* Locations */}
          <div className="col-span-1 flex flex-col gap-3">
            <h3 className="text-white/80 font-semibold mb-2">Locations</h3>
            <Link href="/dubai" className="text-white/50 hover:text-white transition-colors text-sm">Doctors in Dubai</Link>
            <Link href="/abu-dhabi" className="text-white/50 hover:text-white transition-colors text-sm">Doctors in Abu Dhabi</Link>
            <Link href="/sharjah" className="text-white/50 hover:text-white transition-colors text-sm">Doctors in Sharjah</Link>
          </div>

          {/* Company Links */}
          <div className="col-span-1 flex flex-col gap-3">
            <h3 className="text-white/80 font-semibold mb-2">Company</h3>
            <Link href="/about" className="text-white/50 hover:text-white transition-colors text-sm">About us</Link>
            <Link href="/list-your-clinic" className="text-white/50 hover:text-white transition-colors text-sm">List your clinic</Link>
            <Link href="/contact" className="text-white/50 hover:text-white transition-colors text-sm">Contact</Link>
            <Link href="/privacy-policy" className="text-white/50 hover:text-white transition-colors text-sm">Privacy policy</Link>
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors text-sm">Terms</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs">
          <p>© {new Date().getFullYear()} Docmate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
