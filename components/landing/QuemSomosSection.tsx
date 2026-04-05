import Image from "next/image";
import { Brain, Zap, Target } from "lucide-react";

const nexTraits = [
  { icon: Brain, title: "Representação de inteligência" },
  { icon: Zap, title: "Agilidade na resolução de tarefas" },
  { icon: Target, title: "Estratégia e Organização" },
] as const;

export function QuemSomosSection() {
  return (
    <section id="quem-somos" className="scroll-mt-20 border-y border-border bg-card/50 py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            Quem somos
          </h2>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              A NexWork é uma plataforma digital criada para organizar tarefas, projetos e
              equipes com mais clareza e produtividade.
            </p>
            <p>
              Este manual contempla os aspectos relacionados à aplicação do logotipo da empresa
              nos impressos e web. A fim de alcançarmos os objetivos propostos.
            </p>
            <p>
              Dentre eles, fazer do logotipo do NexWork uma ferramenta de uso comum, decorrente
              de uma padronização visual consistente, agregando valores de modernidade, confiança
              e qualidade.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm md:p-10">
            <div className="mb-10 text-center">
              <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Olá, eu sou a Nex
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                Sou a raposa que representa a NexWork — um jeito amigável de lembrar o que nos guia
                no dia a dia.
              </p>
            </div>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-12">
              <div className="flex w-full shrink-0 justify-center lg:w-auto lg:justify-start">
                <div className="relative rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 p-6 ring-1 ring-primary/20">
                  <Image
                    src="/favicon.png"
                    alt="Nex, mascote NexWork — raposa roxa"
                    width={220}
                    height={220}
                    className="h-44 w-44 object-contain md:h-52 md:w-52"
                    sizes="(max-width: 768px) 176px, 208px"
                  />
                </div>
              </div>

              <ul className="flex w-full max-w-md flex-col gap-3 lg:max-w-none lg:flex-1">
                {nexTraits.map((trait) => (
                  <li
                    key={trait.title}
                    className="flex items-center gap-3 rounded-xl border border-border/80 bg-secondary/40 px-4 py-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <trait.icon className="size-5" aria-hidden />
                    </div>
                    <span className="font-display font-medium text-foreground">{trait.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
