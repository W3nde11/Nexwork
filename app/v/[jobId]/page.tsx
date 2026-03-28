"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Logo } from "@/components/Logo";

type Job = {
  id: string;
  title: string;
  description: string;
  budget?: string;
  contractor: { name: string; company?: string };
};

type Msg = {
  id: string;
  sender: "contractor" | "guest";
  body: string;
  createdAt: string;
};

const GUEST_KEY = (jobId: string) => `nw_guest_${jobId}`;
const CONV_KEY = (jobId: string) => `nw_conv_${jobId}`;

export default function PublicJobChatPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<Job | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestSessionId, setGuestSessionId] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !jobId) return;
    let sid = localStorage.getItem(GUEST_KEY(jobId));
    if (!sid) {
      sid =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(GUEST_KEY(jobId), sid);
    }
    setGuestSessionId(sid);
    const cid = localStorage.getItem(CONV_KEY(jobId));
    if (cid) setConversationId(cid);
  }, [jobId]);

  const loadThread = useCallback(async () => {
    if (!conversationId || !guestSessionId) return;
    const u = new URL("/api/guest/thread", window.location.origin);
    u.searchParams.set("conversationId", conversationId);
    u.searchParams.set("guestSessionId", guestSessionId);
    const r = await fetch(u.toString());
    const d = await r.json();
    if (d.messages) setMessages(d.messages);
  }, [conversationId, guestSessionId]);

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/jobs/${jobId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.job) setJob(d.job);
        else setError("Vaga não encontrada.");
      })
      .catch(() => setError("Erro ao carregar."))
      .finally(() => setLoading(false));
  }, [jobId]);

  useEffect(() => {
    if (!conversationId || !guestSessionId) return;
    loadThread();
    const t = setInterval(loadThread, 5000);
    return () => clearInterval(t);
  }, [conversationId, guestSessionId, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim() || !body.trim() || !guestSessionId) {
      setError("Informe seu nome e a mensagem.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const payload = conversationId
        ? { conversationId, guestSessionId, body: body.trim() }
        : {
            jobId,
            guestSessionId,
            guestName: guestName.trim(),
            body: body.trim(),
          };
      const res = await fetch("/api/guest/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao enviar.");
        return;
      }
      if (data.conversationId) {
        setConversationId(data.conversationId);
        localStorage.setItem(CONV_KEY(jobId), data.conversationId);
      }
      setBody("");
      if (data.conversationId) {
        const u = new URL("/api/guest/thread", window.location.origin);
        u.searchParams.set("conversationId", data.conversationId);
        u.searchParams.set("guestSessionId", guestSessionId);
        const r2 = await fetch(u.toString());
        const d2 = await r2.json();
        if (d2.messages) setMessages(d2.messages);
      }
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nw-white">
        <p className="text-nw-gray">Carregando…</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-nw-white px-4 py-10">
        <div className="mx-auto max-w-md text-center">
          <p className="text-red-600">{error || "Não encontrado."}</p>
          <Link href="/" className="mt-4 inline-block text-nw-purple">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-nw-white to-nw-purple/5">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <Logo />
        <span className="rounded-full bg-nw-blue/5 px-3 py-1 text-xs font-medium text-nw-blue">
          Contato pela vaga
        </span>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-12">
        <div className="rounded-2xl border border-nw-blue/10 bg-white p-6 shadow-card">
          <h1 className="text-xl font-bold text-nw-blue">{job.title}</h1>
          {job.budget && (
            <p className="mt-1 text-sm font-medium text-nw-green">{job.budget}</p>
          )}
          <p className="mt-4 whitespace-pre-wrap font-inter text-sm text-nw-blue/85">
            {job.description}
          </p>
          <p className="mt-4 text-xs text-nw-gray">
            Publicado por {job.contractor.company
              ? `${job.contractor.name} (${job.contractor.company})`
              : job.contractor.name}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-nw-blue/10 bg-white shadow-card">
          <div className="border-b border-nw-blue/10 px-4 py-3">
            <h2 className="font-semibold text-nw-blue">Conversa</h2>
            <p className="mt-1 font-inter text-xs text-nw-gray">
              Sem cadastro na NexWork — apenas seu nome para identificar a conversa.
            </p>
          </div>

          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-center font-inter text-sm text-nw-gray">
                Envie a primeira mensagem para o contratante.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "guest" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    m.sender === "guest"
                      ? "bg-nw-green text-white"
                      : "bg-nw-blue/5 text-nw-blue"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.body}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      m.sender === "guest" ? "text-white/80" : "text-nw-gray"
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className="border-t border-nw-blue/10 p-4 space-y-3">
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <div>
              <label className="block text-xs font-medium text-nw-blue">Seu nome</label>
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-nw-blue/15 px-3 py-2 font-inter text-sm"
                placeholder="Como quer ser chamado"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-nw-blue">Mensagem</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-nw-blue/15 px-3 py-2 font-inter text-sm"
                placeholder="Apresente-se e comente seu interesse…"
                required
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-nw-purple py-2.5 text-sm font-semibold text-white hover:bg-nw-purple/90 disabled:opacity-60"
            >
              {sending ? "Enviando…" : "Enviar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
