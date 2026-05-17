"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  Search,
  Share2,
  Tag,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Job = {
  id: string;
  contractorId: string;
  title: string;
  description: string;
  budget?: string;
  tags: string[];
  createdAt: string;
  contractor: { name: string; company?: string } | null;
};

const categories = [
  "Todas",
  "Tecnologia",
  "Design",
  "Marketing",
  "Construção",
  "Educação",
  "Serviços Domésticos",
  "Audiovisual",
  "Consultoria",
  "Outros",
];

function getCategory(job: Job) {
  const match = job.tags.find((tag) =>
    categories.slice(1, -1).some((category) => category.toLowerCase() === tag.toLowerCase())
  );
  return match ?? "Outros";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(date)
  );
}

export function TrabalhosClientPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/jobs").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ])
      .then(([j, m]) => {
        if (j.error) setError(j.error);
        else setJobs(j.jobs || []);
        if (m.user?.id) setMeId(m.user.id);
      })
      .catch(() => setError("Não foi possível carregar."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const category = getCategory(job);
      const matchesCategory = selectedCategory === "Todas" || category === selectedCategory;
      const searchable = [
        job.title,
        job.description,
        job.budget,
        job.contractor?.name,
        job.contractor?.company,
        ...job.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!term || searchable.includes(term));
    });
  }, [jobs, search, selectedCategory]);

  async function createJob(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          budget: budget || undefined,
          tags: tagList,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao publicar.");
        return;
      }
      setTitle("");
      setDescription("");
      setBudget("");
      setTags("");
      load();
    } finally {
      setSaving(false);
    }
  }

  async function removeJob(id: string) {
    if (!confirm("Excluir esta publicação?")) return;
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else setError("Não foi possível excluir.");
  }

  return (
    <div className="container py-8 pb-16">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-accent/10 p-6 shadow-card md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Briefcase className="size-3.5" aria-hidden />
              Trabalhos
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              Encontre oportunidades para trabalhar ou publicar um novo projeto.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              Busque por área, orçamento, palavras-chave e compartilhe links públicos para receber
              interessados pelo chat da NexWork.
            </p>
          </div>
          <a
            href="#nova-publicacao"
            className={cn(buttonVariants({ variant: "hero", size: "lg" }), "shrink-0")}
          >
            <Plus className="size-4" aria-hidden />
            Publicar trabalho
          </a>
        </div>
      </section>

      {error && (
        <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="text"
                placeholder="Buscar trabalhos, tags ou empresas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Trabalhos disponíveis
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredJobs.length} resultado{filteredJobs.length === 1 ? "" : "s"}
              </span>
            </div>

            {loading ? (
              <p className="mt-6 text-sm text-muted-foreground">Carregando trabalhos...</p>
            ) : filteredJobs.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center">
                <Briefcase className="mx-auto mb-3 size-9 text-muted-foreground/70" aria-hidden />
                <p className="font-medium text-foreground">Nenhum trabalho encontrado.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ajuste a busca ou publique uma nova oportunidade.
                </p>
              </div>
            ) : (
              <ul className="mt-5 grid gap-5 md:grid-cols-2">
                {filteredJobs.map((job) => {
                  const mine = meId !== null && job.contractorId === meId;
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
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3.5" aria-hidden />
                          {formatDate(job.createdAt)}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                        {job.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {job.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        {job.budget && (
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="size-4 text-accent" aria-hidden />
                            <span>{job.budget}</span>
                          </p>
                        )}
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4 text-primary" aria-hidden />
                          <span>Remoto ou combinado no chat</span>
                        </p>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="size-4 text-primary" aria-hidden />
                          <span>
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

                      <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
                        <Link
                          href={`/v/${job.id}`}
                          className={cn(buttonVariants({ variant: "hero", size: "sm" }), "flex-1")}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Candidatar-se
                        </Link>
                        <Link
                          href={`/v/${job.id}`}
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Share2 className="size-4" aria-hidden />
                          Detalhes
                        </Link>
                        {mine && (
                          <button
                            type="button"
                            onClick={() => removeJob(job.id)}
                            className="text-sm font-medium text-destructive hover:underline"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <aside
          id="nova-publicacao"
          className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24"
        >
          <h2 className="font-display text-lg font-semibold text-foreground">Nova publicação</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Descreva o trabalho e gere um link para receber candidatos pelo chat.
          </p>
          <form onSubmit={createJob} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Título</label>
              <input
                required
                minLength={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex.: Criar site para loja virtual"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Descrição</label>
              <textarea
                required
                minLength={10}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Escopo, prazo, formato de contratação..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Orçamento (opcional)
              </label>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex.: R$ 1.500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Tags e categoria
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tecnologia, React, Remoto"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Use uma categoria da lista para aparecer no filtro correto.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className={cn(buttonVariants({ variant: "success" }), "w-full")}
            >
              {saving ? "Publicando..." : "Publicar no feed"}
            </button>
          </form>
        </aside>
      </section>
    </div>
  );
}
