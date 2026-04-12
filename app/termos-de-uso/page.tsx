import type { Metadata } from "next";
import { PublicDocumentLayout } from "@/components/PublicDocumentLayout";

export const metadata: Metadata = {
  title: "Termos de Uso — NexWork",
  description: "Condições de uso da plataforma NexWork.",
};

export default function TermosDeUsoPage() {
  return (
    <PublicDocumentLayout title="Termos de Uso">
      <p>
        Ao utilizar a NexWork, você concorda com estas condições. O conteúdo abaixo é um modelo e
        deve ser substituído por versão juridicamente válida para o seu negócio.
      </p>
      <p>
        A plataforma destina-se a contratantes que publicam oportunidades e conversam com
        interessados. Você é responsável pela veracidade das informações das publicações e pelo
        cumprimento das leis trabalhistas e de proteção de dados aplicáveis.
      </p>
      <p>
        Podemos suspender ou encerrar contas em caso de uso indevido, fraude ou violação destes
        termos, mediante os procedimentos previstos em contrato ou legislação.
      </p>
    </PublicDocumentLayout>
  );
}
