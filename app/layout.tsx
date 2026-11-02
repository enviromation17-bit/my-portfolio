import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import LenisProvider from "@/components/LenisProvider";
import GlassNav from "@/components/ui/GlassNav";
import ScrollProgress from "@/components/effects/ScrollProgress";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Renolt — From business goals to verified action",
  description:
    "Renolt helps teams know what needs attention, decide what to do next, run authorized work, and see evidence of the result. Renolt Flow is the business product focus.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-bg">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;900&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body className="bg-bg text-ceramic">
        <ScrollProgress />
        <div className="grain" aria-hidden="true" />
        <LenisProvider>
          <GlassNav />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
