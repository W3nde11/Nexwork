"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/feed", label: "Trabalhos" },
  { href: "/chat", label: "Mensagens" },
];

export function AppHeader({
  userName,
  onLogout,
}: {
  userName: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-nw-blue/10 bg-nw-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-nw-blue text-white"
                  : "text-nw-blue/80 hover:bg-nw-blue/5"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-[140px] truncate text-sm text-nw-gray md:inline">
            {userName}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-nw-blue/15 px-3 py-1.5 text-sm font-medium text-nw-blue hover:bg-nw-blue/5"
          >
            Sair
          </button>
        </div>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto border-t border-nw-blue/5 px-4 pb-2 md:hidden"
        aria-label="Principal mobile"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium",
              pathname === item.href
                ? "bg-nw-blue text-white"
                : "text-nw-blue/80"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
