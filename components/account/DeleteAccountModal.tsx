"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  hasPassword: boolean;
  onDeleted: () => void;
};

export function DeleteAccountModal({ open, onClose, hasPassword, onDeleted }: Props) {
  const [emailLoading, setEmailLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [password, setPassword] = useState("");
  const [phrase, setPhrase] = useState("");

  if (!open) return null;

  async function sendEmailLink() {
    setMsg(null);
    setEmailLoading(true);
    try {
      const res = await fetch("/api/user/delete-request", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ type: "err", text: data.error || "Falha ao enviar." });
        return;
      }
      setMsg({
        type: "ok",
        text:
          data.message ||
          "Enviamos um link para o seu e-mail. Abra-o em até 24 horas para confirmar.",
      });
    } finally {
      setEmailLoading(false);
    }
  }

  async function deleteWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (phrase.trim() !== "EXCLUIR") {
      setMsg({ type: "err", text: 'Digite exatamente EXCLUIR no campo de confirmação.' });
      return;
    }
    setPwdLoading(true);
    try {
      const res = await fetch("/api/user/delete-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, phrase: "EXCLUIR" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ type: "err", text: data.error || "Não foi possível excluir." });
        return;
      }
      onDeleted();
    } finally {
      setPwdLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-destructive/30 bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <h2 id="delete-title" className="font-display text-xl font-bold text-destructive">
            Excluir conta
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-foreground/90">
          Esta ação é <strong>irreversível</strong>: suas publicações, conversas e dados de perfil
          na NexWork serão removidos.
        </p>

        <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Confirmação segura</strong> — você pode confirmar por{" "}
          <strong>link enviado ao e-mail cadastrado</strong> (token válido por 24 horas). Se você
          usa senha na NexWork, também pode confirmar aqui com senha + palavra-chave.{" "}
          <span className="text-foreground/80">
            Em dispositivos compatíveis, navegadores podem exigir biometria ou PIN do sistema antes
            de preencher a senha — isso depende do seu aparelho e do Chrome/Safari/Edge.
          </span>
        </div>

        {msg && (
          <p
            className={cn(
              "mt-4 rounded-lg px-3 py-2 text-sm",
              msg.type === "ok"
                ? "border border-accent/40 bg-accent/10 text-foreground"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {msg.text}
          </p>
        )}

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Opção 1 — E-mail com link</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Enviaremos um link único para o seu e-mail. Só quem tem acesso ao e-mail consegue
              concluir a exclusão.
            </p>
            <button
              type="button"
              disabled={emailLoading}
              onClick={sendEmailLink}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3 inline-flex items-center gap-2"
              )}
            >
              {emailLoading ? <Loader2 className="size-4 animate-spin" /> : null}
              Enviar link de confirmação
            </button>
          </div>

          {hasPassword && (
            <form onSubmit={deleteWithPassword} className="space-y-3 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground">Opção 2 — Senha atual</h3>
              <p className="text-xs text-muted-foreground">
                Digite sua senha e a palavra <strong className="text-foreground">EXCLUIR</strong>{" "}
                para confirmar.
              </p>
              <div>
                <label htmlFor="del-pwd" className="mb-1 block text-xs font-medium text-foreground">
                  Senha atual
                </label>
                <input
                  id="del-pwd"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
                />
              </div>
              <div>
                <label htmlFor="del-phrase" className="mb-1 block text-xs font-medium text-foreground">
                  Confirmação (digite EXCLUIR)
                </label>
                <input
                  id="del-phrase"
                  type="text"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder="EXCLUIR"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
                />
              </div>
              <button
                type="submit"
                disabled={pwdLoading}
                className={cn(
                  buttonVariants({ variant: "destructive", size: "sm" }),
                  "inline-flex items-center gap-2"
                )}
              >
                {pwdLoading ? <Loader2 className="size-4 animate-spin" /> : null}
                Excluir conta agora
              </button>
            </form>
          )}

          {!hasPassword && (
            <p className="border-t border-border pt-4 text-xs text-muted-foreground">
              Sua conta usa login com Google sem senha NexWork — use sempre o{" "}
              <strong className="text-foreground">link enviado por e-mail</strong> para excluir com
              segurança.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
