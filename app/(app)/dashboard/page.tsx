"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="text-2xl font-bold text-nw-blue">Dashboard</h1>
      <p className="mt-1 font-inter text-nw-gray">
        Visão geral das suas publicações e conversas.
      </p>

      {err && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {err} Configure <code className="rounded bg-amber-100 px-1">MONGODB_URI</code> no{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code>.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/feed"
          className="rounded-2xl border border-nw-blue/10 bg-white p-6 shadow-card transition hover:border-nw-purple/30"
        >
          <p className="font-inter text-sm text-nw-gray">Trabalhos publicados</p>
          <p className="mt-2 text-3xl font-bold text-nw-blue">
            {stats ? stats.jobCount : "—"}
          </p>
          <p className="mt-3 text-sm font-medium text-nw-purple">Abrir feed →</p>
        </Link>
        <Link
          href="/chat"
          className="rounded-2xl border border-nw-blue/10 bg-white p-6 shadow-card transition hover:border-nw-green/40"
        >
          <p className="font-inter text-sm text-nw-gray">Conversas ativas</p>
          <p className="mt-2 text-3xl font-bold text-nw-blue">
            {stats ? stats.conversationCount : "—"}
          </p>
          <p className="mt-3 text-sm font-medium text-nw-green">Ver mensagens →</p>
        </Link>
        <div className="rounded-2xl border border-dashed border-nw-blue/20 bg-nw-white p-6 sm:col-span-2 lg:col-span-1">
          <p className="font-inter text-sm text-nw-gray">Próximo passo</p>
          <p className="mt-2 text-sm text-nw-blue/90">
            Publique uma vaga e compartilhe o link com profissionais — eles entram em
            contato pelo chat sem precisar de painel próprio.
          </p>
          <Link
            href="/feed"
            className="mt-4 inline-block rounded-lg bg-nw-blue px-4 py-2 text-sm font-semibold text-white"
          >
            Nova publicação
          </Link>
        </div>
      </div>
    </div>
  );
}
