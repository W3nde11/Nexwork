"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Conv = {
  id: string;
  guestName: string;
  updatedAt: string;
  job: { id: string; title: string } | null;
};

type Msg = {
  id: string;
  sender: "contractor" | "guest";
  body: string;
  createdAt: string;
};

export default function ChatPage() {
  const [list, setList] = useState<Conv[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadList = useCallback(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((d) => {
        if (d.conversations) setList(d.conversations);
      })
      .finally(() => setLoading(false));
  }, []);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!active || !text.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${active}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text.trim() }),
      });
      if (res.ok) {
        setText("");
        loadMessages(active);
        loadList();
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl min-h-[calc(100vh-8rem)] flex-col gap-4 px-4 py-8 md:flex-row md:px-6">
      <aside className="w-full shrink-0 rounded-2xl border border-nw-blue/10 bg-white p-4 shadow-card md:w-72">
        <h1 className="text-lg font-bold text-nw-blue">Mensagens</h1>
        <p className="mt-1 font-inter text-xs text-nw-gray">
          Respostas de interessados pelos links públicos das vagas.
        </p>
        {loading ? (
          <p className="mt-4 text-sm text-nw-gray">Carregando…</p>
        ) : list.length === 0 ? (
          <p className="mt-4 text-sm text-nw-gray">Nenhuma conversa ainda.</p>
        ) : (
          <ul className="mt-4 space-y-1">
            {list.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActive(c.id)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                    active === c.id
                      ? "bg-nw-blue text-white"
                      : "hover:bg-nw-blue/5 text-nw-blue"
                  }`}
                >
                  <span className="font-medium">{c.guestName}</span>
                  {c.job && (
                    <span className="mt-0.5 block truncate text-xs opacity-80">
                      {c.job.title}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="flex flex-1 flex-col rounded-2xl border border-nw-blue/10 bg-white shadow-card">
        {!active ? (
          <div className="flex flex-1 items-center justify-center p-8 font-inter text-nw-gray">
            Selecione uma conversa.
          </div>
        ) : (
          <>
            <div className="border-b border-nw-blue/10 px-4 py-3">
              <p className="text-sm font-semibold text-nw-blue">
                {list.find((x) => x.id === active)?.guestName}
              </p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-[55vh] md:max-h-[calc(100vh-14rem)]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "contractor" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      m.sender === "contractor"
                        ? "bg-nw-purple text-white"
                        : "bg-nw-blue/5 text-nw-blue"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.body}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        m.sender === "contractor" ? "text-white/70" : "text-nw-gray"
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={send} className="border-t border-nw-blue/10 p-4">
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Sua mensagem…"
                  className="flex-1 rounded-xl border border-nw-blue/15 px-3 py-2 font-inter text-sm outline-none focus:ring-2 focus:ring-nw-purple/40"
                />
                <button
                  type="submit"
                  disabled={sending || !text.trim()}
                  className="rounded-xl bg-nw-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
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
