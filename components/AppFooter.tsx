"use client";

import Link from "next/link";
import { AppRatingWidget } from "@/components/AppRatingWidget";
import {
  SITE_APP_NAME,
  SITE_APP_VERSION,
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE,
} from "@/lib/site-meta";

const legal = [
  { href: "/politica-privacidade", label: "Política de Privacidade" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
  { href: "/lgpd", label: "LGPD" },
];

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/25">
      <div className="container max-w-6xl py-5 md:py-6">
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex min-w-0 flex-col items-center">
            <h3 className="mb-1.5 font-display text-xs font-semibold uppercase tracking-wide text-foreground">
              Legal
            </h3>
            <ul className="space-y-1 text-xs">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col items-center">
            <h3 className="mb-1.5 font-display text-xs font-semibold uppercase tracking-wide text-foreground">
              Fale conosco
            </h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                <a
                  href={`mailto:${SITE_CONTACT_EMAIL}`}
                  className="hover:text-primary"
                >
                  {SITE_CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE_CONTACT_PHONE.replace(/\D/g, "")}`} className="hover:text-primary">
                  {SITE_CONTACT_PHONE}
                </a>
              </li>
            </ul>
            <p className="mt-2 max-w-[16rem] text-[11px] leading-snug text-muted-foreground">
              Horário comercial · até 2 dias úteis
            </p>
          </div>

          <div className="flex min-w-0 flex-col items-center">
            <h3 className="mb-1.5 font-display text-xs font-semibold uppercase tracking-wide text-foreground">
              Ajuda
            </h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Perguntas frequentes (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Sobre o sistema
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex min-w-0 flex-col items-center">
            <AppRatingWidget />
          </div>
        </div>

        <p className="mt-5 border-t border-border pt-4 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} {SITE_APP_NAME} · v{SITE_APP_VERSION}
        </p>
      </div>
    </footer>
  );
}
