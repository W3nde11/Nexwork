"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { isPasswordPolicyCompliant, PASSWORD_POLICY_DESCRIPTION } from "@/lib/password-policy";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function ChangePasswordModal({ open, onClose, onSuccess }: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!isPasswordPolicyCompliant(next)) {
      setErr(PASSWORD_POLICY_DESCRIPTION);
      return;
    }
    if (next !== confirm) {
      setErr("A confirmação não coincide com a nova senha.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Não foi possível alterar a senha.");
        return;
      }
      setCurrent("");
      setNext("");
      setConfirm("");
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwd-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <h2 id="pwd-title" className="font-display text-lg font-bold text-foreground">
            Alterar senha de acesso
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
        <p className="mt-2 text-sm text-muted-foreground">
          Informe a senha atual e escolha uma nova senha. {PASSWORD_POLICY_DESCRIPTION}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {err && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>
          )}
          <div>
            <label htmlFor="pwd-current" className="mb-1 block text-sm font-medium text-foreground">
              Senha atual
            </label>
            <input
              id="pwd-current"
              type="password"
              autoComplete="current-password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="pwd-new" className="mb-1 block text-sm font-medium text-foreground">
              Nova senha
            </label>
            <input
              id="pwd-new"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="pwd-confirm" className="mb-1 block text-sm font-medium text-foreground">
              Confirmar nova senha
            </label>
            <input
              id="pwd-confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(buttonVariants({ variant: "hero" }), "inline-flex items-center gap-2")}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Salvar nova senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
