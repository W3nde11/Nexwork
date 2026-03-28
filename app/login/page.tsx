"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
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
    <div className="mx-auto w-full max-w-md rounded-2xl border border-nw-blue/10 bg-white p-8 shadow-card">
      <h1 className="text-xl font-semibold text-nw-blue">Entrar</h1>
      <p className="mt-1 font-inter text-sm text-nw-gray">
        Acesso exclusivo para contratantes.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-nw-blue">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-nw-blue/15 px-3 py-2 font-inter text-nw-blue outline-none ring-nw-purple/30 focus:ring-2"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-nw-blue"
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
            className="mt-1 w-full rounded-lg border border-nw-blue/15 px-3 py-2 font-inter text-nw-blue outline-none ring-nw-purple/30 focus:ring-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-nw-blue py-2.5 text-sm font-semibold text-white transition hover:bg-nw-blue/90 disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="mt-6 text-center font-inter text-sm text-nw-gray">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-nw-purple hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-nw-white px-4 py-10">
      <div className="mx-auto mb-8 flex max-w-md justify-center">
        <Logo />
      </div>
      <Suspense fallback={<div className="mx-auto max-w-md text-center text-nw-gray">Carregando…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
