const values: { label: string; swatch: string }[] = [
  { label: "Inovação", swatch: "bg-primary" },
  { label: "Organização", swatch: "bg-navy" },
  { label: "Colaboração", swatch: "bg-accent" },
  { label: "Eficiência", swatch: "bg-destructive" },
  { label: "Evolução contínua", swatch: "bg-muted-foreground" },
];

export function MissaoVisaoValoresSection() {
  return (
    <section id="missao-visao-valores" className="scroll-mt-20 bg-secondary/50 py-16 md:py-20">
      <div className="container">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
            Missão, Visão e Valores
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:items-stretch md:gap-8">
          <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-card">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Missão</h3>
              <p className="mt-3 text-left text-sm leading-relaxed text-muted-foreground md:text-base">
                Ajudar pessoas e empresas a organizar tarefas e projetos com tecnologia.
              </p>
            </div>
            <div className="my-8 border-t border-border" aria-hidden />
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Visão</h3>
              <p className="mt-3 text-left text-sm leading-relaxed text-muted-foreground md:text-base">
                Ser uma plataforma referência em gestão de trabalho e produtividade.
              </p>
            </div>
          </div>

          <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-card">
            <h3 className="font-display text-lg font-bold text-foreground">Valores</h3>
            <ul className="mt-6 flex flex-col gap-4">
              {values.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span
                    className={`size-3 shrink-0 rounded-sm ${item.swatch}`}
                    aria-hidden
                  />
                  <span className="text-left text-sm font-medium text-foreground md:text-base">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
