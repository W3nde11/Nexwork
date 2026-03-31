import { UserPlus, FileText, Link2, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Crie sua conta",
    description: "Cadastro rápido como contratante para publicar e gerir mensagens.",
  },
  {
    icon: FileText,
    title: "Publique no feed",
    description: "Descreva o trabalho, orçamento e tags. Tudo em cards claros.",
  },
  {
    icon: Link2,
    title: "Compartilhe o link",
    description: "Profissionais entram pela página pública da vaga — sem painel extra.",
  },
  {
    icon: MessageSquare,
    title: "Converse no chat",
    description: "Centralize o contato com interessados e feche alinhamentos.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-secondary/50 py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Do cadastro à conversa em poucos passos
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {i + 1}
              </div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                <step.icon className="text-primary-foreground" size={28} />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
