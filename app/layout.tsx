import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollRevealInit";

import { Providers } from "@/components/Providers";
import Analytics from "@/components/Analytics";
import {
  GTM_CONTAINER_ID,
  GTM_GUARD_SNIPPET,
  GTM_LOADER_SNIPPET,
} from "@/lib/analytics";
import { SITE_URL } from "@/lib/constants";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
      <head>
        {/*
          Server-rendered on purpose — see lib/analytics.ts. The tag has to be in
          the HTML itself, not injected after hydration, or GA4's Tag coverage
          report cannot see it. The guard must stay ahead of the loader.
        */}
        {GTM_CONTAINER_ID ? (
          <>
            <script
              id="gtm-guard"
              dangerouslySetInnerHTML={{ __html: GTM_GUARD_SNIPPET }}
            />
            <script
              id="gtm-init"
              dangerouslySetInnerHTML={{ __html: GTM_LOADER_SNIPPET }}
            />
          </>
        ) : null}
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Fallback for visitors with JavaScript disabled. */}
        {GTM_CONTAINER_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}
        <Analytics />
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
