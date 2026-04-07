import Image from "next/image";
import { Brain, Zap, Target } from "lucide-react";

const nexTraits = [
  { icon: Brain, title: "Representação de inteligência" },
  { icon: Zap, title: "Agilidade na resolução de tarefas" },
  { icon: Target, title: "Estratégia e Organização" },
] as const;

const leadership = [
  {
    name: "Gabriel Almeida",
    role: "CEO",
    description: "Responsável pela visão estratégica da plataforma.",
    photo: "/team/gabriel-almeida.svg",
  },
  {
    name: "Wendell",
    role: "CTO",
    description: "Responsável pelo desenvolvimento tecnológico.",
    photo: "/team/wendell.svg",
  },
  {
    name: "Tales",
    role: "CPO",
    description: "Responsável pela experiência do usuário e evolução do produto.",
    photo: "/team/tales.svg",
  },
] as const;

const supportGroup = [
  {
    name: "Marco Sales",
    description: "Coordenador do Curso de Análise e Desenvolvimento de Sistemas.",
  },
  {
    name: "Afonso Silva",
    description: "Professor orientador do projeto.",
  },
] as const;

export function QuemSomosSection() {
  return (
    <section id="quem-somos" className="scroll-mt-20 border-y border-border bg-card/50 py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            Quem somos
          </h2>
          <div className="space-y-6 text-center text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              A NexWork nasceu com uma ideia simples: transformar conhecimento e tecnologia em
              soluções reais.
            </p>
            <p>
              Somos um projeto focado em inovação, desenvolvimento e aprendizado constante.
              Acreditamos que a tecnologia não deve ser complicada — ela deve ser acessível, útil e
              capaz de criar novas oportunidades para quem quer aprender, construir e evoluir.
            </p>
            <p>
              Na NexWork, exploramos ideias, desenvolvemos projetos e experimentamos novas
              tecnologias. Cada linha de código representa uma chance de criar algo melhor, mais
              inteligente e mais eficiente.
            </p>
            <p>
              Mais do que um projeto, a NexWork é um espaço para experimentar, aprender e construir
              o futuro através da tecnologia.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <h3 className="mb-8 text-center font-display text-2xl font-bold text-foreground md:text-3xl">
            Nossa equipe
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {leadership.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-border bg-card p-6 text-left shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
                    <Image
                      src={member.photo}
                      alt={`Retrato de ${member.name}`}
                      fill
                      sizes="56px"
                      className="object-cover object-center"
                      unoptimized={member.photo.endsWith(".svg")}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-semibold leading-tight text-foreground">
                      {member.name}
                    </p>
                    <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-border bg-secondary/30 p-6 md:p-8">
            <h4 className="mb-4 text-center font-display text-lg font-semibold text-foreground">
              Grupo de apoio
            </h4>
            <ul className="mx-auto grid max-w-3xl gap-4 text-center sm:grid-cols-2 sm:text-left">
              {supportGroup.map((person) => (
                <li key={person.name} className="rounded-xl border border-border/80 bg-card/80 px-4 py-3">
                  <p className="font-medium text-foreground">{person.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{person.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm md:p-10">
            <div className="mb-10 text-center">
              <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Olá, eu sou a Nex!
              </h3>
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
