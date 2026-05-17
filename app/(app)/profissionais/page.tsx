"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Search, Star, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const categories = [
  "Todas",
  "Tecnologia",
  "Design",
  "Marketing",
  "Construção",
  "Educação",
  "Serviços Domésticos",
  "Audiovisual",
  "Consultoria",
];

const professionals = [
  {
    name: "Ana Costa",
    role: "Desenvolvedora Full Stack",
    category: "Tecnologia",
    rating: 4.9,
    reviews: 47,
    location: "São Paulo, SP",
    skills: ["React", "Node.js", "TypeScript"],
    avatar: "AC",
  },
  {
    name: "João Silva",
    role: "Designer Gráfico",
    category: "Design",
    rating: 4.8,
    reviews: 63,
    location: "Rio de Janeiro, RJ",
    skills: ["Photoshop", "Illustrator", "Branding"],
    avatar: "JS",
  },
  {
    name: "Maria Santos",
    role: "Marketing Digital",
    category: "Marketing",
    rating: 5,
    reviews: 31,
    location: "Remoto",
    skills: ["SEO", "Google Ads", "Social Media"],
    avatar: "MS",
  },
  {
    name: "Carlos Lima",
    role: "Eletricista",
    category: "Construção",
    rating: 4.7,
    reviews: 89,
    location: "Belo Horizonte, MG",
    skills: ["Instalação", "Manutenção", "Projeto"],
    avatar: "CL",
  },
  {
    name: "Patrícia Ramos",
    role: "Professora de Inglês",
    category: "Educação",
    rating: 4.9,
    reviews: 55,
    location: "Remoto",
    skills: ["Conversação", "TOEFL", "Business"],
    avatar: "PR",
  },
  {
    name: "Diego Ferreira",
    role: "Videomaker",
    category: "Audiovisual",
    rating: 4.6,
    reviews: 28,
    location: "Curitiba, PR",
    skills: ["Edição", "Drone", "Motion"],
    avatar: "DF",
  },
];

export default function ProfissionaisPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const filteredProfessionals = useMemo(() => {
    const term = search.trim().toLowerCase();
    return professionals.filter((professional) => {
      const matchesCategory =
        selectedCategory === "Todas" || professional.category === selectedCategory;
      const searchable = [
        professional.name,
        professional.role,
        professional.category,
        professional.location,
        ...professional.skills,
      ]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!term || searchable.includes(term));
    });
  }, [search, selectedCategory]);

  return (
    <div className="container py-8 pb-16">
      <section className="app-hero-banner">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-foreground">
            <Users className="size-3.5" aria-hidden />
            Profissionais
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-navy-foreground md:text-4xl">
            Busque profissionais qualificados para o seu próximo trabalho.
          </h1>
          <p className="mt-3 text-sm leading-6 text-navy-foreground/75 md:text-base">
            Encontre especialistas por nome, área ou habilidade e publique uma oportunidade para
            iniciar a contratação pela NexWork.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="relative max-w-xl">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Buscar por nome, área ou habilidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Profissionais em destaque
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredProfessionals.length} resultado
            {filteredProfessionals.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfessionals.map((professional) => (
            <article
              key={professional.name}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/25 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                  {professional.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display font-semibold text-foreground">
                    {professional.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{professional.role}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1">
                <Star className="size-4 fill-yellow-500 text-yellow-500" aria-hidden />
                <span className="text-sm font-medium text-foreground">
                  {professional.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({professional.reviews} avaliações)
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden />
                <span>{professional.location}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {professional.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex gap-2 border-t border-border pt-4">
                <Link
                  href="/trabalhos#nova-publicacao"
                  className={cn(buttonVariants({ variant: "hero", size: "sm" }), "flex-1")}
                >
                  Contratar
                </Link>
                <Link
                  href="/chat"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  Mensagem
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
