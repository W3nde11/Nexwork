import type { Metadata } from "next";
import { PublicDocumentLayout } from "@/components/PublicDocumentLayout";
import {
  SITE_APP_NAME,
  SITE_APP_VERSION,
  SITE_DEVELOPER,
  SITE_DISTRIBUTION,
} from "@/lib/site-meta";

export const metadata: Metadata = {
  title: "Sobre o sistema — NexWork",
  description: "Informações sobre a aplicação NexWork.",
};

export default function SobrePage() {
  return (
    <PublicDocumentLayout title="Sobre o sistema">
      <dl className="space-y-4">
        <div>
          <dt className="font-medium text-foreground">Nome</dt>
          <dd>{SITE_APP_NAME}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Versão</dt>
          <dd>{SITE_APP_VERSION}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Descrição</dt>
          <dd>
            Plataforma web para contratantes publicarem trabalhos, compartilharem o link da vaga e
            conversarem com profissionais pelo chat integrado.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Desenvolvimento</dt>
          <dd>{SITE_DEVELOPER}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Distribuição</dt>
          <dd>{SITE_DISTRIBUTION}</dd>
        </div>
      </dl>
      <p className="pt-4">
        Stack principal: Next.js, React, MongoDB (quando configurado), autenticação com sessão
        segura e integrações opcionais (e-mail, OAuth).
      </p>
    </PublicDocumentLayout>
  );
}
