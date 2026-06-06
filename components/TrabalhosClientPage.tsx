"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  Paperclip,
  Search,
  Share2,
  Tag,
  Users,
  X,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Job = {
  id: string;
  contractorId: string;
  category?: string;
  title: string;
  description: string;
  budget?: string;
  tags: string[];
  attachments?: string[];
  experienceLevel?: "iniciante" | "intermediario" | "especialista";
  proposalDays?: number;
  visibility?: "publico" | "privado";
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

const experienceOptions = [
  {
    value: "iniciante",
    title: "Iniciante",
    description: "Estou a procura de freelancers com os menores valores.",
  },
  {
    value: "intermediario",
    title: "Intermediário",
    description: "Estou a procura de uma combinação de experiência e valor.",
  },
  {
    value: "especialista",
    title: "Especialista",
    description: "Estou disposto a pagar valores mais elevados para freelancers experientes.",
  },
] as const;

function getCategory(job: Job) {
  if (job.category) return job.category;
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
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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
      const isMine = meId !== null && job.contractorId === meId;
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
      return !isMine && matchesCategory && (!term || searchable.includes(term));
    });
  }, [jobs, meId, search, selectedCategory]);

  async function removeJob(id: string) {
    if (!confirm("Excluir esta publicação?")) return;
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else setError("Não foi possível excluir.");
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

  async function startPrivateConversation(job: Job) {
    setError("");
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Não foi possível iniciar a conversa.");
      return;
    }

    router.push(`/chat?conversation=${data.conversationId}`);
  }

  return (
    <div className="container py-8 pb-16">
      <section className="app-hero-banner">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Briefcase className="size-3.5" aria-hidden />
              Trabalhos
            </span>
          <h1 className="mt-4 text-balance font-display text-2xl font-bold leading-tight text-navy sm:text-3xl md:text-4xl">
              Encontre oportunidades para trabalhar.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              Busque por área, orçamento, palavras-chave e compartilhe links públicos para receber
              interessados pelo chat da NexWork.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <p className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <section className="mt-8">
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
                  "rounded-full px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm",
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3.5" aria-hidden />
                          {formatDate(job.createdAt)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="mt-4 break-words text-left font-display text-lg font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                      >
                        {job.title}
                      </button>
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

                      <div className="mt-auto grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => startPrivateConversation(job)}
                          className={cn(buttonVariants({ variant: "hero", size: "sm" }), "w-full")}
                        >
                          Candidatar-se
                        </button>
                        <button
                          type="button"
                          onClick={() => shareJob(job)}
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                        >
                          <Share2 className="size-4" aria-hidden />
                          Compartilhar
                        </button>
                        {mine && (
                          <button
                            type="button"
                            onClick={() => removeJob(job.id)}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 sm:col-span-2"
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

      </section>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/60 p-3 py-6 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-2xl sm:max-h-[90vh] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {getCategory(selectedJob)}
                </span>
                <h2 className="mt-4 break-words font-display text-xl font-bold text-foreground sm:text-2xl">
                  {selectedJob.title}
                </h2>
                <p className="mt-2 break-words text-sm text-muted-foreground">
                  Publicado por{" "}
                  {selectedJob.contractor?.company
                    ? `${selectedJob.contractor.name} · ${selectedJob.contractor.company}`
                    : selectedJob.contractor?.name ?? "Contratante NexWork"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Fechar detalhes"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Descrição</h3>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                  {selectedJob.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
                  <span className="block text-xs font-medium uppercase tracking-wide text-foreground">
                    Propostas
                  </span>
                  {selectedJob.proposalDays ?? 30} dias
                </p>
                <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
                  <span className="block text-xs font-medium uppercase tracking-wide text-foreground">
                    Visibilidade
                  </span>
                  {selectedJob.visibility === "privado" ? "Privado" : "Público"}
                </p>
                <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
                  <span className="block text-xs font-medium uppercase tracking-wide text-foreground">
                    Experiência
                  </span>
                  {experienceOptions.find((option) => option.value === selectedJob.experienceLevel)?.title ??
                    "Intermediário"}
                </p>
                <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
                  <span className="block text-xs font-medium uppercase tracking-wide text-foreground">
                    Local
                  </span>
                  Remoto ou combinado no chat
                </p>
              </div>

              {selectedJob.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Habilidades</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedJob.tags
                      .filter((tag) => tag !== getCategory(selectedJob))
                      .map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex max-w-full items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                        >
                          <Tag className="size-3" aria-hidden />
                          <span className="min-w-0 truncate">{tag}</span>
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {selectedJob.attachments && selectedJob.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Anexos</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {selectedJob.attachments.map((file) => (
                      <li key={file} className="flex min-w-0 items-center gap-2">
                        <Paperclip className="size-4 shrink-0 text-primary" aria-hidden />
                        <span className="min-w-0 break-all">{file}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => startPrivateConversation(selectedJob)}
                className={cn(buttonVariants({ variant: "hero", size: "sm" }), "w-full")}
              >
                Candidatar-se
              </button>
              <button
                type="button"
                onClick={() => shareJob(selectedJob)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
              >
                <Share2 className="size-4" aria-hidden />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
