"use client";

import { X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PermanencePolicyModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <h2 id="policy-title" className="font-display text-xl font-bold text-foreground">
            Política de permanência na NexWork
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
          Manter sua conta <strong className="text-foreground">ativa</strong> como contratante
          amplia o que você consegue fazer na plataforma.
        </p>
        <ul className="mt-4 space-y-3 text-sm text-foreground/90">
          <li className="flex gap-2">
            <span className="mt-0.5 font-bold text-primary">•</span>
            <span>
              <strong className="text-foreground">Publicações e visibilidade</strong> — vagas e
              chamadas continuam acessíveis por link; profissionais podem encontrar e responder às
              suas oportunidades.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 font-bold text-accent">•</span>
            <span>
              <strong className="text-foreground">Chat e histórico</strong> — conversas com
              interessados permanecem organizadas no mesmo lugar, com contexto das mensagens e da
              vaga relacionada.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 font-bold text-primary">•</span>
            <span>
              <strong className="text-foreground">Notificações</strong> — você recebe avisos no app,
              por e-mail ou em outros canais que configurar, conforme a frequência escolhida.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 font-bold text-accent">•</span>
            <span>
              <strong className="text-foreground">Confiança</strong> — um perfil ativo e
              atualizado transmite continuidade para quem busca trabalho com você.
            </span>
          </li>
        </ul>
        <p className="mt-4 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
          Contas inativas por longos períodos podem ter recursos limitados ou exigir nova
          verificação, conforme nossos termos de uso.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={cn(buttonVariants({ variant: "hero" }))}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
