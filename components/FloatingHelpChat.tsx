"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE_CONTACT_EMAIL, SITE_CONTACT_PHONE } from "@/lib/site-meta";

const quickLinks = [
  { href: "/faq", label: "Perguntas frequentes (FAQ)" },
  { href: "/sobre", label: "Sobre o sistema" },
  { href: "/politica-privacidade", label: "Política de Privacidade" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
];

export function FloatingHelpChat() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[59] bg-navy/30 backdrop-blur-[2px] transition-opacity md:bg-navy/15"
          aria-label="Fechar painel de ajuda"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex max-w-[100vw] flex-col items-end gap-3 p-0 sm:bottom-6 sm:right-6">
        <div
          id="help-chat-panel"
          className={cn(
            "pointer-events-auto w-[min(calc(100vw-2.5rem),22rem)] origin-bottom-right transition-all duration-200",
            open
              ? "visible scale-100 opacity-100"
              : "invisible pointer-events-none scale-95 opacity-0"
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-chat-title"
        >
          <div className="max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-5 text-primary" aria-hidden />
                <h2
                  id="help-chat-title"
                  className="font-display text-sm font-semibold text-foreground"
                >
                  Central de ajuda
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 px-4 py-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Encontre respostas rápidas ou fale com a equipe NexWork pelos canais abaixo.
              </p>

              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-foreground">
                  Links úteis
                </p>
                <ul className="space-y-1.5">
                  {quickLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="text-xs text-primary underline-offset-2 hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-foreground">
                  Fale conosco
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Mail className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                    <a
                      href={`mailto:${SITE_CONTACT_EMAIL}?subject=Ajuda%20NexWork`}
                      className="break-all text-foreground hover:text-primary"
                    >
                      {SITE_CONTACT_EMAIL}
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                    <a
                      href={`tel:${SITE_CONTACT_PHONE.replace(/\D/g, "")}`}
                      className="text-foreground hover:text-primary"
                    >
                      {SITE_CONTACT_PHONE}
                    </a>
                  </li>
                </ul>
              </div>

              <p className="rounded-lg bg-secondary/50 px-3 py-2 text-[11px] text-muted-foreground">
                Resposta em até <strong className="text-foreground">2 dias úteis</strong> no horário
                comercial.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "pointer-events-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/35 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            open && "ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
          aria-expanded={open}
          aria-controls="help-chat-panel"
          aria-label={open ? "Fechar ajuda" : "Abrir chat de ajuda"}
        >
          {open ? (
            <X className="size-7" aria-hidden />
          ) : (
            <HelpCircle className="size-7" aria-hidden />
          )}
        </button>
      </div>
    </>
  );
}
