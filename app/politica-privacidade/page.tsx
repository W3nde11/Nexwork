import type { Metadata } from "next";
import { PublicDocumentLayout } from "@/components/PublicDocumentLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade — NexWork",
  description: "Como a NexWork trata dados pessoais dos usuários.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <PublicDocumentLayout title="Política de Privacidade">
      <p>
        Este documento descreve como a plataforma NexWork coleta, usa e protege informações dos
        contratantes e visitantes. O texto completo deve ser revisado por assessoria jurídica antes
        da publicação oficial.
      </p>
      <p>
        Em linhas gerais: utilizamos dados para operar publicações de vagas, chats e notificações;
        não vendemos seus dados a terceiros para marketing; adotamos medidas técnicas e
        organizacionais compatíveis com boas práticas de segurança.
      </p>
      <p>
        Para exercer direitos previstos na legislação (acesso, correção, exclusão, portabilidade,
        etc.), utilize os canais em <strong className="text-foreground">Fale conosco</strong> no
        rodapé.
      </p>
    </PublicDocumentLayout>
  );
}
