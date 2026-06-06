"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AppRatingWidget } from "@/components/AppRatingWidget";
import { PublishProjectModal } from "@/components/PublishProjectModal";
import { cn } from "@/lib/cn";
import {
  Briefcase,
  Clock,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Share2,
  Star,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";

type Stats = {
  jobCount: number;
  conversationCount: number;
};

type Me = {
  id: string;
  email: string;
  name: string;
  company?: string;
  professionalTitle?: string;
  bio?: string;
  professionalExperience?: string;
  interestAreas?: string[];
  skills?: string[];
  location?: string;
  portfolio?: string;
  avatar?: string | null;
};

type Job = {
  id: string;
  contractorId: string;
  category?: string;
  title: string;
  description: string;
  budget?: string;
  tags: string[];
  createdAt: string;
  visibility?: "publico" | "privado";
  contractor: { name: string; company?: string } | null;
};

const statCards = [
  {
    label: "Trabalhos ativos",
    key: "jobCount",
    icon: Briefcase,
    color: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    label: "Mensagens",
    key: "conversationCount",
    icon: MessageSquare,
    color: "text-accent",
    iconBg: "bg-accent/10",
  },
  {
    label: "Avaliação média",
    value: "—",
    icon: Star,
    color: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
  },
  {
    label: "Propostas",
    value: "0",
    icon: TrendingUp,
    color: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [publishOpen, setPublishOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editVisibility, setEditVisibility] = useState<"publico" | "privado">("publico");
  const [editSaving, setEditSaving] = useState(false);
  const [err, setErr] = useState("");

  const loadDashboard = useCallback(() => {
    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()),
      fetch("/api/user/profile").then((r) => r.json()),
      fetch("/api/jobs").then((r) => r.json()),
    ])
      .then(([dashboard, profile, jobList]) => {
        if (dashboard.error && dashboard.jobCount === undefined) setErr(dashboard.error);
        else {
          setStats({
            jobCount: dashboard.jobCount ?? 0,
            conversationCount: dashboard.conversationCount ?? 0,
          });
        }
        if (profile.user) setMe(profile.user);
        if (jobList.jobs) {
          const myJobs = profile.user?.id
            ? jobList.jobs.filter((job: Job) => job.contractorId === profile.user.id)
            : [];
          setJobs(myJobs);
        }
      })
      .catch(() => setErr("Falha ao carregar."));
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const firstName = me?.name?.split(" ")[0] ?? "";
  const profileInitials =
    me?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "NW";

  function getCategory(job: Job) {
    return job.category ?? job.tags[0] ?? "Outros";
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
      new Date(date)
    );
  }

  function openEdit(job: Job) {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditDescription(job.description);
    setEditTags(job.tags.filter((tag) => tag !== getCategory(job)).join(", "));
    setEditVisibility(job.visibility ?? "publico");
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingJob) return;

    setEditSaving(true);
    setErr("");
    try {
      const tags = [getCategory(editingJob), ...editTags.split(",").map((tag) => tag.trim()).filter(Boolean)];
      const res = await fetch(`/api/jobs/${editingJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          tags,
          visibility: editVisibility,
        }),
      });
      if (!res.ok) {
        setErr("Não foi possível editar a publicação.");
        return;
      }
      setEditingJob(null);
      loadDashboard();
    } finally {
      setEditSaving(false);
    }
  }

  async function removeJob(id: string) {
    if (!confirm("Excluir esta publicação?")) return;
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (res.ok) loadDashboard();
    else setErr("Não foi possível excluir a publicação.");
  }

  async function shareJob(job: Job) {
    const url = `${window.location.origin}/v/${job.id}`;
    const text = `Confira este projeto na NexWork: ${job.title}`;

    if (navigator.share) {
      await navigator.share({
        title: job.title,
        text,
        url,
      });
      return;
    }

    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="container space-y-8 py-8 pb-16">
      {err && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {err} Configure <code className="rounded bg-amber-100 px-1">MONGODB_URI</code> no{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code>.
        </p>
      )}

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
        <Image
          src="/dashboard-banner-bg.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-center"
        />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">
              Olá{firstName ? `, ${firstName}` : ""}!
            </p>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-navy md:text-4xl">
              Bem-vindo ao{" "}
              <span>
                <span className="text-primary">Nex</span>
                <span className="text-accent">Work</span>
              </span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              Acompanhe suas publicações, encontre oportunidades e conecte-se com profissionais para acelerar
              seu próximo projeto.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/trabalhos"
                className={cn(buttonVariants({ variant: "hero", size: "lg" }), "h-11 w-full px-6 text-sm sm:w-auto")}
              >
                <Search className="size-4" aria-hidden />
                Encontrar trabalho
              </Link>
              <button
                type="button"
                onClick={() => setPublishOpen(true)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent/40 bg-white px-6 text-sm font-semibold text-accent transition hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
              >
                <Plus className="size-4" aria-hidden />
                Publicar trabalho
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              const value =
                "key" in card && stats
                  ? stats[card.key]
                  : "value" in card
                  ? card.value
                  : "—";
              return (
                <div key={card.label} className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      card.iconBg
                    )}
                  >
                    <Icon className={cn("size-4", card.color)} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-bold leading-none text-navy">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Suas publicações
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Trabalhos que você publicou na plataforma.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPublishOpen(true)}
              className="self-start text-sm font-medium text-primary hover:underline sm:self-auto"
            >
              Nova publicação
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Briefcase className="mx-auto mb-3 size-8 opacity-50" aria-hidden />
              <p>Nenhuma publicação sua ainda.</p>
              <button
                type="button"
                onClick={() => setPublishOpen(true)}
                className={cn(buttonVariants({ variant: "link", size: "sm" }), "mt-2")}
              >
                Publicar trabalho
              </button>
            </div>
          ) : (
            <ul className="mt-5 grid gap-5 md:grid-cols-2">
              {jobs.map((job) => {
                const category = getCategory(job);

                return (
                  <li
                    key={job.id}
                    className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/25 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {category}
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3.5" aria-hidden />
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    <h3 className="mt-4 break-words font-display text-lg font-semibold text-foreground">
                      {job.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {job.description}
                    </p>

                    <div className="mt-4 space-y-2">
                      {job.budget && (
                        <p className="text-sm text-muted-foreground">{job.budget}</p>
                      )}
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4 text-primary" aria-hidden />
                        <span>Remoto ou combinado no chat</span>
                      </p>
                      <p className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                        <Users className="size-4 shrink-0 text-primary" aria-hidden />
                        <span className="min-w-0 truncate">
                          {job.contractor?.company
                            ? `${job.contractor.name} · ${job.contractor.company}`
                            : job.contractor?.name ?? "Contratante NexWork"}
                        </span>
                      </p>
                    </div>

                    {job.tags?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                          >
                            <Tag className="size-3" aria-hidden />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto grid gap-2 border-t border-border pt-4 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => shareJob(job)}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                      >
                        <Share2 className="size-4" aria-hidden />
                        Compartilhar
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(job)}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => removeJob(job.id)}
                        className="w-full rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <aside className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-foreground">Resumo do meu perfil</h2>
            <div className="mt-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary text-lg font-bold text-primary">
                  {me?.avatar ? (
                    <Image
                      src={me.avatar}
                      alt={`Foto de perfil de ${me.name}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{profileInitials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold text-foreground">
                    {me?.name ?? "—"}
                  </p>
                  {me?.professionalTitle && (
                    <p className="mt-1 text-sm font-medium text-primary">{me.professionalTitle}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {me?.location || "Local não informado"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Empresa</p>
                  <p className="mt-1 text-foreground">{me?.company || "Adicione sua empresa"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contato</p>
                  <p className="mt-1 break-all text-foreground">{me?.email ?? "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sobre mim</p>
                <p className="mt-1 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {me?.bio || "Complete seu perfil para aparecer melhor para contratantes."}
                </p>
              </div>

              {me?.interestAreas && me.interestAreas.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Áreas de interesse
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {me.interestAreas.slice(0, 4).map((area) => (
                      <span key={area} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                        {area}
                      </span>
                    ))}
                    {me.interestAreas.length > 4 && (
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                        +{me.interestAreas.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {me?.skills && me.skills.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Habilidades</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {me.skills.slice(0, 6).map((skill) => (
                      <span key={skill} className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                        {skill}
                      </span>
                    ))}
                    {me.skills.length > 6 && (
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                        +{me.skills.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {me?.portfolio && (
                <a
                  href={/^https?:\/\//i.test(me.portfolio) ? me.portfolio : `https://${me.portfolio}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Ver portfólio
                </a>
              )}
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
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/60 p-3 py-6 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-2xl sm:max-h-[90vh] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-display text-xl font-semibold text-foreground">Editar publicação</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Atualize as principais informações do trabalho publicado.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Fechar edição"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Título</label>
                <input
                  required
                  minLength={3}
                  maxLength={75}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Descrição</label>
                <textarea
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={5}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Habilidades / tags
                </label>
                <input
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="React, Design, Remoto"
                />
                <p className="mt-1 text-xs text-muted-foreground">Separe por vírgulas.</p>
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-foreground">
                  Visibilidade do projeto
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label
                    className={cn(
                      "cursor-pointer rounded-lg border p-3 transition-colors",
                      editVisibility === "publico"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/40"
                    )}
                  >
                    <span className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="editVisibility"
                        value="publico"
                        checked={editVisibility === "publico"}
                        onChange={() => setEditVisibility("publico")}
                        className="mt-1 accent-primary"
                      />
                      <span>
                        <span className="block text-sm font-medium text-foreground">Público</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          Visível para profissionais na tela de trabalhos.
                        </span>
                      </span>
                    </span>
                  </label>
                  <label
                    className={cn(
                      "cursor-pointer rounded-lg border p-3 transition-colors",
                      editVisibility === "privado"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/40"
                    )}
                  >
                    <span className="flex items-start gap-2">
                      <input
                        type="radio"
                        name="editVisibility"
                        value="privado"
                        checked={editVisibility === "privado"}
                        onChange={() => setEditVisibility("privado")}
                        className="mt-1 accent-primary"
                      />
                      <span>
                        <span className="block text-sm font-medium text-foreground">Privado</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          Apenas você vê no dashboard.
                        </span>
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>

              <div className="grid gap-2 pt-2 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={editSaving}
                  className={cn(buttonVariants({ variant: "success" }), "w-full")}
                >
                  {editSaving ? "Salvando..." : "Salvar alterações"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <PublishProjectModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onCreated={loadDashboard}
      />
    </div>
  );
}
