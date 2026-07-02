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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpeg" alt="Doc Mate Logo" width={32} height={32} className="rounded-full" />
              <span className="font-bold text-lg tracking-tight">Docmate.</span>
            </Link>
            <p className="text-white/50 text-sm max-w-xs">
              Doctor appointments made easy. Find and book trusted doctors in Dubai instantly.
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white/80 font-semibold mb-2">Platform</h4>
            <Link href="/search" className="text-white/50 hover:text-white transition-colors text-sm">Find a doctor</Link>
            <Link href="/#specialties" className="text-white/50 hover:text-white transition-colors text-sm">Specialties</Link>
            <Link href="/#emirates" className="text-white/50 hover:text-white transition-colors text-sm">Browse by city</Link>
            <Link href="/#insurance" className="text-white/50 hover:text-white transition-colors text-sm">Insurance guide</Link>
            <Link href="/blog" className="text-white/50 hover:text-white transition-colors text-sm">Health blog</Link>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white/80 font-semibold mb-2">Company</h4>
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
          <p className="font-medium">Dubai Healthcare City · Jumeirah · Al Barsha · Deira</p>
        </div>
      </div>
    </footer>
  );
}
