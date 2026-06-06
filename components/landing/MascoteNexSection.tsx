import Image from "next/image";
import { Brain, Target, Zap } from "lucide-react";

const nexTraits = [
  { icon: Brain, title: "Representação de inteligência" },
  { icon: Zap, title: "Agilidade na resolução de tarefas" },
  { icon: Target, title: "Estratégia e Organização" },
] as const;

export function MascoteNexSection() {
  return (
    <section id="mascote-nex" className="scroll-mt-16 bg-background py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8 md:p-10">
            <div className="mb-10 text-center">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Olá, eu sou a Nex!
              </h2>
              <p className="mx-auto mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
                Inspirada na inteligência e agilidade da raposa, a Nex representa a essência da nossa
                marca: pensar com estratégia, agir com rapidez e resolver problemas com inteligência.
                Ela simboliza a forma como trabalhamos — analisando cada desafio com organização,
                criatividade e eficiência.
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
                    <span className="min-w-0 break-words font-display text-sm font-medium text-foreground sm:text-base">{trait.title}</span>
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
