"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { href: "/", label: "Map" },
  { href: "/regions", label: "Regions" },
  { href: "/routes", label: "Routes" }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-sky-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
            UK runners
          </span>
          <span className="text-lg font-semibold text-slate-900">
            Can I go for a run today?
          </span>
        </Link>
        <nav className="flex gap-2 text-sm font-medium">
          {tabs.map((tab) => {
            const active =
              tab.href === "/"
                ? pathname === "/"
                : pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                  "rounded-full px-3 py-1 transition-colors",
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-700 hover:bg-skysoft"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

