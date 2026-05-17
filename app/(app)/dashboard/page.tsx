"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AppRatingWidget } from "@/components/AppRatingWidget";
import { cn } from "@/lib/cn";
import {
  Briefcase,
  MessageSquare,
  Plus,
  Search,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

type Stats = {
  jobCount: number;
  conversationCount: number;
};

type Me = {
  email: string;
  name: string;
  company?: string;
};

type Job = {
  id: string;
  title: string;
  description: string;
  budget?: string;
  tags: string[];
  contractor: { name: string; company?: string } | null;
};

const statCards = [
  { label: "Trabalhos Ativos", key: "jobCount", icon: Briefcase, color: "text-primary" },
  { label: "Mensagens", key: "conversationCount", icon: MessageSquare, color: "text-accent" },
  { label: "Avaliação Média", value: "—", icon: Star, color: "text-yellow-500" },
  { label: "Propostas", value: "0", icon: TrendingUp, color: "text-green-500" },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/jobs").then((r) => r.json()),
    ])
      .then(([dashboard, auth, jobList]) => {
        if (dashboard.error && dashboard.jobCount === undefined) setErr(dashboard.error);
        else {
          setStats({
            jobCount: dashboard.jobCount ?? 0,
            conversationCount: dashboard.conversationCount ?? 0,
          });
        }
        if (auth.user) setMe(auth.user);
        if (jobList.jobs) setJobs(jobList.jobs.slice(0, 3));
      })
      .catch(() => setErr("Falha ao carregar."));
  }, []);

  const firstName = me?.name?.split(" ")[0] ?? "";

  return (
    <div className="container space-y-8 py-8 pb-16">
      {err && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {err} Configure <code className="rounded bg-amber-100 px-1">MONGODB_URI</code> no{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code>.
        </p>
      )}

      <section className="app-hero-banner">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Painel NexWork</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-navy-foreground md:text-4xl">
              Bem-vindo{firstName ? `, ${firstName}` : ""}!
            </h1>
            <p className="mt-3 text-sm leading-6 text-navy-foreground/75 md:text-base">
              Acompanhe suas publicações, encontre trabalhos e descubra profissionais para acelerar
              o próximo projeto.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/trabalhos"
              className={cn(buttonVariants({ variant: "hero", size: "lg" }))}
            >
              <Search className="size-4" aria-hidden />
              Encontrar trabalho
            </Link>
            <Link
              href="/trabalhos#nova-publicacao"
              className={cn(buttonVariants({ variant: "success", size: "lg" }))}
            >
              <Plus className="size-4" aria-hidden />
              Publicar trabalho
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value =
            "key" in card && stats
              ? stats[card.key]
              : "value" in card
              ? card.value
              : "—";
          return (
            <div key={card.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-foreground">
                    {value}
                  </p>
                </div>
                <div className={cn("flex size-10 items-center justify-center rounded-lg bg-muted", card.color)}>
                  <Icon className="size-5" aria-hidden />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Oportunidades recentes
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Últimos trabalhos publicados na plataforma.
              </p>
            </div>
            <Link href="/trabalhos" className="text-sm font-medium text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Briefcase className="mx-auto mb-3 size-8 opacity-50" aria-hidden />
              <p>Nenhuma oportunidade ainda.</p>
              <Link
                href="/trabalhos"
                className={cn(buttonVariants({ variant: "link", size: "sm" }), "mt-2")}
              >
                Explorar trabalhos
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/25"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{job.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {job.description}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {job.contractor?.company
                          ? `${job.contractor.name} · ${job.contractor.company}`
                          : job.contractor?.name ?? "Contratante NexWork"}
                      </p>
                    </div>
                    {job.budget && (
                      <span className="shrink-0 rounded-md bg-accent/15 px-2 py-1 text-xs font-medium text-foreground">
                        {job.budget}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <aside className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-foreground">Seu perfil</h2>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="font-medium text-foreground">{me?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="break-all text-sm font-medium text-foreground">{me?.email ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Empresa</p>
                <p className="font-medium text-foreground">{me?.company || "Adicione sua empresa"}</p>
              </div>
            </div>
            <Link
              href="/conta"
              className={cn(buttonVariants({ variant: "outline" }), "mt-6 w-full")}
            >
              Editar perfil
            </Link>
            <Link
              href="/profissionais"
              className={cn(buttonVariants({ variant: "hero-outline" }), "mt-3 w-full")}
            >
              <Users className="size-4" aria-hidden />
              Buscar profissionais
            </Link>
          </aside>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <AppRatingWidget />
          </section>
        </div>
      </section>
    </div>
  );
}
