"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-foreground/10 bg-navy text-navy-foreground shadow-lg shadow-navy/10">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo footer href="/dashboard" />
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
        <div className="hidden min-w-0 items-center gap-2 md:flex md:gap-3">
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
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-navy-foreground/20 text-navy-foreground transition-colors hover:bg-navy-foreground/10 md:hidden"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>
      {mobileOpen && (
        <div className="container pb-4 md:hidden">
          <nav
            className="animate-fade-in rounded-2xl border border-navy-foreground/10 bg-navy-foreground/95 p-3 text-navy shadow-xl"
            aria-label="Principal mobile"
          >
            <div className="space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.href || (item.href === "/trabalhos" && pathname === "/feed")
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-navy hover:bg-navy/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 border-t border-navy/10 pt-3">
              <Link
                href="/conta"
                title="Minha conta"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block truncate rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/conta" || pathname.startsWith("/conta/")
                    ? "bg-accent/10 text-navy"
                    : "text-navy/70 hover:bg-navy/5 hover:text-navy"
                )}
              >
                {userName}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onLogout();
                }}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-2 w-full border-navy/15 bg-transparent text-navy hover:bg-navy/5"
                )}
              >
                Sair
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
