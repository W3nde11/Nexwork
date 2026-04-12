"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LandingHeader } from "@/components/LandingHeader";
import { AppFooter } from "@/components/AppFooter";
import { Button } from "@/components/ui/button";

const OAUTH_ERRORS: Record<string, string> = {
  google_denied: "Login com Google foi cancelado.",
  google_config:
    "Login com Google não está configurado (credenciais no servidor).",
  oauth_state:
    'Sessão inválida ou expirada. Tente "Continuar com Google" de novo.',
  oauth_failed: "Não foi possível concluir o login com Google.",
  email_unverified: "O e-mail da conta Google precisa estar verificado.",
  google_account_mismatch:
    "Este e-mail já está associado a outra conta Google.",
  google_oauth: "Não foi possível autorizar com Google.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const oauthErr = searchParams.get("error");
  const oauthMessage = oauthErr ? OAUTH_ERRORS[oauthErr] ?? null : null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Não foi possível entrar.");
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Entrar</h1>
        <p className="text-muted-foreground">Acesso para contratantes NexWork</p>
      </div>
      <GoogleSignInButton next={next} className="mb-2" />
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-background px-2 text-muted-foreground">ou com e-mail</span>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {(error || oauthMessage) && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error || oauthMessage}
          </p>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
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
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>
        <Button variant="hero" type="submit" disabled={loading} className="h-11 w-full">
          {loading ? "Entrando…" : "Entrar"}
        </Button>
        <p className="text-center text-sm">
          <Link
            href="/recuperar-senha"
            className="font-medium text-primary hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex flex-1 items-center justify-center py-20">
        <Suspense
          fallback={
            <div className="text-center text-muted-foreground">Carregando…</div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
      <AppFooter />
    </div>
  );
}
