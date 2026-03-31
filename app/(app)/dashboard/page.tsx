"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export default function DashboardPage() {
  const [stats, setStats] = useState<{ jobCount: number; conversationCount: number } | null>(
    null
  );
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.error && d.jobCount === undefined) setErr(d.error);
        else setStats({ jobCount: d.jobCount ?? 0, conversationCount: d.conversationCount ?? 0 });
      })
      .catch(() => setErr("Falha ao carregar."));
  }, []);

  return (
    <div className="container py-8">
      <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Visão geral das suas publicações e conversas.
      </p>

      {err && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {err} Configure <code className="rounded bg-amber-100 px-1">MONGODB_URI</code> no{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code>.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/feed"
          className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/30"
        >
          <p className="text-sm text-muted-foreground">Trabalhos publicados</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">
            {stats ? stats.jobCount : "—"}
          </p>
          <p className="mt-3 text-sm font-medium text-primary">Abrir feed →</p>
        </Link>
        <Link
          href="/chat"
          className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-accent/40"
        >
          <p className="text-sm text-muted-foreground">Conversas ativas</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">
            {stats ? stats.conversationCount : "—"}
          </p>
          <p className="mt-3 text-sm font-medium text-accent">Ver mensagens →</p>
        </Link>
        <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-6 sm:col-span-2 lg:col-span-1">
          <p className="text-sm text-muted-foreground">Próximo passo</p>
          <p className="mt-2 text-sm text-foreground/90">
            Publique uma vaga e compartilhe o link com profissionais — eles entram em contato
            pelo chat sem precisar de painel próprio.
          </p>
          <Link
            href="/feed"
            className={cn(buttonVariants({ variant: "hero", size: "sm" }), "mt-4 inline-flex")}
          >
            Nova publicação
          </Link>
        </div>
      </div>
    </div>
  );
}
