import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Can I go for a run today?",
  description: "UK run readiness, maps and weather advice for the next 24 hours."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-skysoft text-slate-900">
        <TopNav />
        <main className="mx-auto max-w-6xl px-4 py-4">{children}</main>
      </body>
    </html>
  );
}

