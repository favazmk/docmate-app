import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollRevealInit";

import { Providers } from "@/components/Providers";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Doc Mate | Doctor appointments made easy",
  description: "Find and book trusted doctors in Dubai - instantly. Verified specialists in Dubai Healthcare City, Jumeirah, Al Barsha, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", publicSans.variable)}>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <ScrollRevealInit />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
