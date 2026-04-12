"use client";

import { useState } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { AppFooter } from "@/components/AppFooter";
import { Button } from "@/components/ui/button";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Não foi possível enviar o pedido.");
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="w-full max-w-md mx-auto p-8">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-display text-3xl font-bold text-foreground">
              Recuperar senha
            </h1>
            <p className="text-muted-foreground">
              Enviaremos um link seguro para o seu e-mail (válido por 1 hora).
            </p>
          </div>
          {sent ? (
            <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-foreground">
              Se esse e-mail estiver cadastrado, você receberá instruções para redefinir a senha.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
                />
              </div>
              <Button variant="hero" type="submit" disabled={loading} className="h-11 w-full">
                {loading ? "Enviando…" : "Enviar link"}
              </Button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-primary hover:underline">
              Voltar ao login
            </Link>
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
