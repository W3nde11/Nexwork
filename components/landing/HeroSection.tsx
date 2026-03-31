"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function HeroSection() {
  const [search, setSearch] = useState("");

  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="animate-fade-in font-display text-4xl font-bold leading-tight md:text-6xl">
            Conectando <span className="text-gradient">talentos</span> a oportunidades
          </h1>

          <p
            className="mx-auto max-w-xl animate-fade-in text-lg text-navy-foreground/70 md:text-xl"
            style={{ animationDelay: "0.1s" }}
          >
            Publique trabalhos, compartilhe o link da vaga e converse com interessados —
            tudo com poucos cliques e visual limpo.
          </p>

          <div
            className="mx-auto flex max-w-lg flex-col gap-3 animate-fade-in sm:flex-row"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="text"
                placeholder="Que trabalho você precisa?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Link
              href="/#categorias"
              className={cn(buttonVariants({ variant: "hero", size: "lg" }), "h-12")}
            >
              Ver categorias
            </Link>
          </div>

          <div
            className="flex flex-col justify-center gap-4 animate-fade-in sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/cadastro"
              className={cn(buttonVariants({ variant: "hero", size: "lg" }), "gap-2")}
            >
              Sou contratante <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "hero-outline", size: "lg" }),
                "border-navy-foreground/30 text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground gap-2"
              )}
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
