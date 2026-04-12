import type { Metadata } from "next";
import { PublicDocumentLayout } from "@/components/PublicDocumentLayout";

export const metadata: Metadata = {
  title: "FAQ — NexWork",
  description: "Perguntas frequentes sobre a plataforma NexWork.",
};

const items = [
  {
    q: "Como publico uma vaga?",
    a: "Após entrar como contratante, acesse Trabalhos (feed), crie uma publicação e compartilhe o link com profissionais.",
  },
  {
    q: "Preciso pagar para usar o chat?",
    a: "As regras comerciais dependem do plano vigente da NexWork. Consulte Termos de Uso ou suporte.",
  },
  {
    q: "Como altero minha senha?",
    a: "Em Minha conta, use a seção Senha de acesso ou recuperação de senha na tela de login.",
  },
  {
    q: "Posso usar só login com Google?",
    a: "Sim. Contas criadas com Google podem definir uma senha NexWork depois, pela recuperação de senha.",
  },
];

export default function FaqPage() {
  return (
    <PublicDocumentLayout title="Perguntas frequentes (FAQ)">
      <ul className="list-none space-y-6 p-0">
        {items.map((item) => (
          <li key={item.q}>
            <p className="font-medium text-foreground">{item.q}</p>
            <p className="mt-2">{item.a}</p>
          </li>
        ))}
      </ul>
    </PublicDocumentLayout>
  );
}
