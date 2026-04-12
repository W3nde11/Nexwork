"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LandingHeader } from "@/components/LandingHeader";
import { AppFooter } from "@/components/AppFooter";
import { Button } from "@/components/ui/button";
import { isPasswordPolicyCompliant, PASSWORD_POLICY_DESCRIPTION } from "@/lib/password-policy";

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isPasswordPolicyCompliant(password)) {
      setError(PASSWORD_POLICY_DESCRIPTION);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company: company || undefined,
          email,
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Não foi possível cadastrar.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
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
              Criar conta
            </h1>
            <p className="text-muted-foreground">Contratante — publique e gerencie mensagens</p>
          </div>
          <GoogleSignInButton next="/dashboard" className="mb-2" />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-background px-2 text-muted-foreground">ou cadastre-se com e-mail</span>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                Nome completo
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label
                htmlFor="company"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Empresa (opcional)
              </label>
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nome da empresa"
              />
            </div>
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
              <p className="mb-2 text-xs text-muted-foreground">{PASSWORD_POLICY_DESCRIPTION}</p>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <Button variant="hero" type="submit" disabled={loading} className="h-11 w-full">
              {loading ? "Criando conta…" : "Criar conta"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
