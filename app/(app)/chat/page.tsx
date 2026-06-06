"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Paperclip } from "lucide-react";
import { cn } from "@/lib/cn";

type Conv = {
  id: string;
  guestName: string;
  otherName: string;
  currentUserRole: "contractor" | "guest";
  participantProfile: CandidateProfile | null;
  updatedAt: string;
  job: { id: string; title: string } | null;
};

type CandidateProfile = {
  name: string;
  company: string;
  professionalTitle: string;
  bio: string;
  professionalExperience: string;
  interestAreas: string[];
  skills: string[];
  location: string;
  portfolio: string;
  avatar: string | null;
};

type Msg = {
  id: string;
  sender: "contractor" | "guest";
  body: string;
  attachments?: MessageAttachment[];
  createdAt: string;
};

type MessageAttachment = {
  type: "image" | "document" | "link";
  name: string;
  url: string;
};

type PendingFileAttachment = MessageAttachment & {
  fileName: string;
};

function getConversationTone(role: Conv["currentUserRole"]) {
  return role === "contractor"
    ? {
        label: "Minha publicação",
        activeClass: "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25",
        idleClass: "border-primary/25 bg-primary/5 text-foreground hover:bg-primary/10",
        badgeClass: "bg-primary/10 text-primary",
      }
    : {
        label: "Minha candidatura",
        activeClass: "border-accent bg-accent text-accent-foreground shadow-md shadow-accent/25",
        idleClass: "border-accent/25 bg-accent/5 text-foreground hover:bg-accent/10",
        badgeClass: "bg-accent/10 text-accent",
      };
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [list, setList] = useState<Conv[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFileAttachment[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const activeConversation = list.find((x) => x.id === active);
  const candidateProfile =
    activeConversation?.currentUserRole === "contractor" ? activeConversation.participantProfile : null;

  const loadList = useCallback(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((d) => {
        if (d.conversations) {
          setList(d.conversations);
          const requestedConversation = searchParams.get("conversation");
          if (requestedConversation && d.conversations.some((c: Conv) => c.id === requestedConversation)) {
            setActive(requestedConversation);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const loadMessages = useCallback((id: string) => {
    fetch(`/api/conversations/${id}/messages`)
      .then((r) => r.json())
      .then((d) => {
        if (d.messages) setMessages(d.messages);
      });
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (!active) return;
    loadMessages(active);
    const t = setInterval(() => loadMessages(active), 5000);
    return () => clearInterval(t);
  }, [active, loadMessages]);

  function readFileAsAttachment(file: File): Promise<PendingFileAttachment> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          type: file.type.startsWith("image/") ? "image" : "document",
          name: file.name,
          fileName: file.name,
          url: String(reader.result),
        });
      };
      reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
      reader.readAsDataURL(file);
    });
  }

  async function onFilesSelected(files: FileList | null) {
    if (!files?.length) return;
    setError("");

    const selected = Array.from(files).slice(0, 5 - pendingFiles.length);
    const oversized = selected.find((file) => file.size > 2 * 1024 * 1024);
    if (oversized) {
      setError("Cada arquivo deve ter no máximo 2 MB.");
      return;
    }

    try {
      const attachments = await Promise.all(selected.map(readFileAsAttachment));
      setPendingFiles((current) => [...current, ...attachments].slice(0, 5));
    } catch {
      setError("Não foi possível anexar o arquivo.");
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const attachments: MessageAttachment[] = pendingFiles.map(
      ({ fileName: _fileName, ...attachment }) => attachment
    );

    if (!active || (!text.trim() && attachments.length === 0)) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/conversations/${active}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text.trim(), attachments }),
      });
      if (res.ok) {
        setText("");
        setPendingFiles([]);
        loadMessages(active);
        loadList();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Não foi possível enviar a mensagem.");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] flex-col gap-4 py-4 sm:py-8 md:flex-row">
      <aside
        className={cn(
          "w-full shrink-0 rounded-2xl border border-border bg-card p-4 shadow-card md:block md:w-72",
          active && "hidden"
        )}
      >
        <h1 className="font-display text-lg font-bold text-foreground">Mensagens</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Conversas privadas sobre projetos e oportunidades.
        </p>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Carregando…</p>
        ) : list.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhuma conversa ainda.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {list.map((c) => {
              const tone = getConversationTone(c.currentUserRole);
              const selected = active === c.id;

              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActive(c.id)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                      selected ? tone.activeClass : tone.idleClass
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate font-medium">{c.otherName}</span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          selected ? "bg-white/20 text-current" : tone.badgeClass
                        )}
                      >
                        {tone.label}
                      </span>
                    </span>
                    {c.job && (
                      <span className="mt-1 block truncate text-xs opacity-80">
                        {c.job.title}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <section className={cn("flex flex-1 flex-col rounded-2xl border border-border bg-card shadow-card", !active && "hidden md:flex")}>
        {!active ? (
          <div className="flex flex-1 items-center justify-center p-8 text-muted-foreground">
            Selecione uma conversa.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <button
                type="button"
                onClick={() => setActive(null)}
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground md:hidden"
                aria-label="Voltar para conversas"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {activeConversation?.otherName}
                </p>
                {activeConversation && (
                  <span
                    className={cn(
                      "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      getConversationTone(activeConversation.currentUserRole).badgeClass
                    )}
                  >
                    {getConversationTone(activeConversation.currentUserRole).label}
                  </span>
                )}
              </div>
            </div>
            {candidateProfile && (
              <div className="border-b border-border bg-secondary/30 px-4 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                    {candidateProfile.avatar ? (
                      <Image
                        src={candidateProfile.avatar}
                        alt=""
                        width={56}
                        height={56}
                        unoptimized={candidateProfile.avatar.startsWith("data:")}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-sm font-bold text-muted-foreground">
                        {candidateProfile.name
                          .split(/\s+/)
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="break-words font-display text-sm font-semibold text-foreground">
                          {candidateProfile.name}
                        </p>
                        {candidateProfile.professionalTitle && (
                          <p className="mt-0.5 break-words text-xs font-medium text-primary">
                            {candidateProfile.professionalTitle}
                          </p>
                        )}
                        {candidateProfile.location && (
                          <p className="mt-0.5 break-words text-xs text-muted-foreground">
                            {candidateProfile.location}
                          </p>
                        )}
                      </div>
                      {candidateProfile.portfolio && (
                        <a
                          href={
                            /^https?:\/\//i.test(candidateProfile.portfolio)
                              ? candidateProfile.portfolio
                              : `https://${candidateProfile.portfolio}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Ver portfólio
                        </a>
                      )}
                    </div>
                    {candidateProfile.bio && (
                      <p className="mt-3 line-clamp-3 text-xs leading-5 text-muted-foreground">
                        {candidateProfile.bio}
                      </p>
                    )}
                    {candidateProfile.professionalExperience && (
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">
                        <span className="font-medium text-foreground">Experiência: </span>
                        {candidateProfile.professionalExperience}
                      </p>
                    )}
                    {candidateProfile.interestAreas.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {candidateProfile.interestAreas.map((area) => (
                          <span
                            key={area}
                          className="max-w-full break-words rounded-md bg-card px-2 py-1 text-[11px] text-muted-foreground"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                    {candidateProfile.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {candidateProfile.skills.map((skill) => (
                          <span
                            key={skill}
                            className="max-w-full break-words rounded-md bg-primary/10 px-2 py-1 text-[11px] text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="max-h-[60vh] flex-1 space-y-3 overflow-y-auto p-4 md:max-h-[calc(100vh-14rem)]">
              {messages.map((m) => {
                const mine = m.sender === activeConversation?.currentUserRole;

                return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={cn(
                      "max-w-[88%] break-words rounded-2xl px-4 py-2 text-sm sm:max-w-[85%]",
                      mine
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {m.body && <p className="whitespace-pre-wrap">{m.body}</p>}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {m.attachments.map((attachment) =>
                          attachment.type === "image" ? (
                            <a
                              key={`${attachment.name}-${attachment.url}`}
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block overflow-hidden rounded-xl border border-white/20 bg-background/10"
                            >
                              <Image
                                src={attachment.url}
                                alt={attachment.name}
                                width={320}
                                height={180}
                                unoptimized
                                className="max-h-48 w-full object-cover"
                              />
                            </a>
                          ) : (
                            <a
                              key={`${attachment.name}-${attachment.url}`}
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className={cn(
                                "block break-all rounded-lg border px-3 py-2 text-xs underline-offset-2 hover:underline",
                                mine
                                  ? "border-primary-foreground/20 bg-primary-foreground/10"
                                  : "border-border bg-background"
                              )}
                            >
                              {attachment.type === "link" ? "Link de portfólio: " : "Anexo: "}
                              {attachment.name}
                            </a>
                          )
                        )}
                      </div>
                    )}
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        mine ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {new Date(m.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
                );
              })}
            </div>
            <form onSubmit={send} className="space-y-3 border-t border-border p-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              {pendingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pendingFiles.map((file) => (
                    <button
                      key={file.fileName}
                      type="button"
                      onClick={() =>
                        setPendingFiles((current) =>
                          current.filter((item) => item.fileName !== file.fileName)
                        )
                      }
                      className="max-w-full truncate rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
                    >
                      Remover {file.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <label
                  className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border text-foreground transition hover:bg-secondary"
                  aria-label="Anexar arquivo"
                  title="Anexar arquivo"
                >
                  <Paperclip className="size-5" aria-hidden />
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                    className="sr-only"
                    onChange={(e) => {
                      onFilesSelected(e.target.files);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Sua mensagem..."
                  className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={sending || (!text.trim() && pendingFiles.length === 0)}
                  className="h-11 shrink-0 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/20 disabled:opacity-50 sm:px-4"
                >
                  Enviar
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
