"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

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
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company: company || undefined, email, password }),
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
    <div className="min-h-screen bg-nw-white px-4 py-10">
      <div className="mx-auto mb-8 flex max-w-md justify-center">
        <Logo />
      </div>
      <div className="mx-auto w-full max-w-md rounded-2xl border border-nw-blue/10 bg-white p-8 shadow-card">
        <h1 className="text-xl font-semibold text-nw-blue">Cadastro — Contratante</h1>
        <p className="mt-1 font-inter text-sm text-nw-gray">
          Crie sua conta para publicar trabalhos e gerenciar mensagens.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-nw-blue">
              Nome completo
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-nw-blue/15 px-3 py-2 font-inter text-nw-blue outline-none ring-nw-purple/30 focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-nw-blue"
            >
              Empresa (opcional)
            </label>
            <input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 w-full rounded-lg border border-nw-blue/15 px-3 py-2 font-inter text-nw-blue outline-none ring-nw-purple/30 focus:ring-2"
            />
          </div>
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
              Senha (mín. 6 caracteres)
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-nw-blue/15 px-3 py-2 font-inter text-nw-blue outline-none ring-nw-purple/30 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-nw-purple py-2.5 text-sm font-semibold text-white transition hover:bg-nw-purple/90 disabled:opacity-60"
          >
            {loading ? "Criando conta…" : "Cadastrar"}
          </button>
        </form>
        <p className="mt-6 text-center font-inter text-sm text-nw-gray">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-nw-blue hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
