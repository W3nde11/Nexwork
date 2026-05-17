"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trabalhos", label: "Trabalhos" },
  { href: "/profissionais", label: "Profissionais" },
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
    <header className="sticky top-0 z-40 border-b border-navy-foreground/10 bg-navy text-navy-foreground shadow-lg shadow-navy/10">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo footer />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || (item.href === "/trabalhos" && pathname === "/feed")
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-navy-foreground/70 hover:bg-navy-foreground/10 hover:text-navy-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <Link
            href="/conta"
            title="Minha conta"
            className={cn(
              "max-w-[120px] truncate text-sm transition-colors sm:max-w-[160px] md:max-w-[200px]",
              pathname === "/conta" || pathname.startsWith("/conta/")
                ? "font-medium text-accent"
                : "text-navy-foreground/70 hover:text-navy-foreground"
            )}
          >
            {userName}
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-navy-foreground/25 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
            )}
          >
            Sair
          </button>
        </div>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto border-t border-navy-foreground/10 px-4 pb-3 md:hidden"
        aria-label="Principal mobile"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium",
              pathname === item.href || (item.href === "/trabalhos" && pathname === "/feed")
                ? "bg-primary text-primary-foreground"
                : "text-navy-foreground/70"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
