"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { LandingHeader } from "@/components/LandingHeader";
import { AppFooter } from "@/components/AppFooter";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function ConfirmDeleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "err">("idle");
  const [errText, setErrText] = useState("");

  async function confirm() {
    if (!token?.trim()) return;
    setStatus("loading");
    setErrText("");
    try {
      const res = await fetch("/api/user/delete-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setErrText(data.error || "Não foi possível concluir.");
        return;
      }
      setStatus("done");
      setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 1800);
    } catch {
      setStatus("err");
      setErrText("Erro de rede.");
    }
  }

  if (!token?.trim()) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center shadow-card">
        <p className="text-sm text-muted-foreground">
          Link inválido ou incompleto. Solicite um novo e-mail em{" "}
          <Link href="/conta" className="font-medium text-primary hover:underline">
            Minha conta
          </Link>
          .
        </p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-accent/40 bg-accent/10 p-6 text-center">
        <p className="font-medium text-foreground">Conta excluída com sucesso.</p>
        <p className="mt-2 text-sm text-muted-foreground">Redirecionando…</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-destructive/30 bg-card p-6 shadow-card">
      <h2 className="font-display text-lg font-bold text-foreground">Confirmar exclusão</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ao confirmar, sua conta NexWork e os dados associados (vagas, conversas, perfil) serão{" "}
        <strong className="text-foreground">removidos permanentemente</strong>.
      </p>
      {status === "err" && (
        <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errText}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={status === "loading"}
          onClick={confirm}
          className={cn(buttonVariants({ variant: "destructive" }), "inline-flex items-center gap-2")}
        >
          {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
          Sim, excluir minha conta
        </button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Cancelar
        </Link>
      </div>
    </div>
  );
}

export default function ExcluirContaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="container flex flex-1 flex-col items-center justify-center py-16">
        <Suspense
          fallback={
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              Carregando…
            </div>
          }
        >
          <div className="w-full max-w-md">
            <h1 className="text-center font-display text-2xl font-bold text-foreground">
              Exclusão de conta
            </h1>
            <div className="mt-8">
              <ConfirmDeleteContent />
            </div>
          </div>
        </Suspense>
      </main>
      <AppFooter />
    </div>
  );
}
