import type { Metadata } from "next";
import { PublicDocumentLayout } from "@/components/PublicDocumentLayout";

export const metadata: Metadata = {
  title: "LGPD — NexWork",
  description: "Transparência sobre tratamento de dados pessoais (Lei nº 13.709/2018).",
};

export default function LgpdPage() {
  return (
    <PublicDocumentLayout title="LGPD — Lei Geral de Proteção de Dados">
      <p>
        A NexWork busca estar alinhada à Lei nº 13.709/2018 (LGPD). Esta página resume pontos de
        contato para titulares de dados; o detalhamento legal consta na Política de Privacidade e
        nos registros de operações de tratamento mantidos pelo controlador.
      </p>
      <p>
        <strong className="text-foreground">Base legal:</strong> execução de contrato, legítimo
        interesse quando aplicável, consentimento quando necessário e cumprimento de obrigação
        legal.
      </p>
      <p>
        <strong className="text-foreground">Direitos do titular:</strong> você pode solicitar
        confirmação de tratamento, acesso, correção, anonimização, portabilidade e informações sobre
        compartilhamento, nos limites da lei, pelos canais indicados no rodapé.
      </p>
      <p>
        <strong className="text-foreground">Encarregado (DPO):</strong> indique aqui o contato
        oficial quando houver nomeação formal.
      </p>
    </PublicDocumentLayout>
  );
}
