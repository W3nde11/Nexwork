"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

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

export default function FeedPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    <div className="container py-8">
      <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
        Feed de trabalhos
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Oportunidades em cards — publique e compartilhe o link da vaga para contato.
      </p>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-foreground">Nova publicação</h2>
        <form onSubmit={createJob} className="mt-4 space-y-4">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground">Título</label>
            <input
              required
              minLength={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex.: Dev React — 3 meses"
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
              placeholder="Escopo, prazo, stack…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Orçamento (opcional)
              </label>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex.: R$ 5k–8k"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Tags (vírgula)
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="react, remoto, pj"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/20 transition hover:bg-accent/90 disabled:opacity-60"
          >
            {saving ? "Publicando…" : "Publicar no feed"}
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Todas as oportunidades
        </h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Carregando…</p>
        ) : jobs.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhuma vaga ainda. Seja o primeiro!</p>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {jobs.map((job) => {
              const mine = meId !== null && job.contractorId === meId;
              return (
                <li
                  key={job.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-foreground">{job.title}</h3>
                    {job.budget && (
                      <span className="shrink-0 rounded-md bg-accent/15 px-2 py-0.5 text-xs font-medium text-foreground">
                        {job.budget}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{job.description}</p>
                  {job.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {job.contractor?.company
                      ? `${job.contractor.name} · ${job.contractor.company}`
                      : job.contractor?.name}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                    <Link
                      href={`/v/${job.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Link público (chat)
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
      </section>
    </div>
  );
}
