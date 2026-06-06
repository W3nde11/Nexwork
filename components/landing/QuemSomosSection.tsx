import Image from "next/image";

const leadership = [
  {
    name: "Gabriel Almeida",
    role: "CEO",
    description: "Responsável pela visão estratégica da plataforma.",
    photo: "/team/gabriel-almeida.png",
  },
  {
    name: "Wendell Campos",
    role: "CTO",
    description: "Responsável pelo desenvolvimento tecnológico.",
    photo: "/team/wendell.png",
  },
  {
    name: "Tales Ferraz",
    role: "CPO",
    description: "Responsável pela experiência do usuário e evolução do produto.",
    photo: "/team/tales.png",
  },
] as const;

export function QuemSomosSection() {
  return (
    <section id="quem-somos" className="scroll-mt-16 border-y border-border bg-card/50 py-16 md:py-20">
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
                className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm sm:p-6"
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
                    <p className="break-words font-display text-lg font-semibold leading-tight text-foreground">
                      {member.name}
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-primary">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
