import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Buster AI — Job Listing Risk & Resume Fit",
  description: "Screen job listings for common scam and ghost-job signals, and compare resume skills.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#fafafa] antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <div className="relative min-h-screen cyber-grid flex flex-col justify-between">{children}</div>
      </body>
    </html>
  );
}
