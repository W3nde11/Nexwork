import {
  Monitor,
  Palette,
  Megaphone,
  Wrench,
  GraduationCap,
  Home,
  Camera,
  Briefcase,
  Heart,
  PartyPopper,
} from "lucide-react";

const categories = [
  { name: "Tecnologia", icon: Monitor, count: 234 },
  { name: "Design", icon: Palette, count: 189 },
  { name: "Marketing", icon: Megaphone, count: 156 },
  { name: "Construção", icon: Wrench, count: 98 },
  { name: "Educação", icon: GraduationCap, count: 127 },
  { name: "Serviços Domésticos", icon: Home, count: 203 },
  { name: "Audiovisual", icon: Camera, count: 87 },
  { name: "Consultoria", icon: Briefcase, count: 145 },
  { name: "Saúde", icon: Heart, count: 112 },
  { name: "Eventos", icon: PartyPopper, count: 76 },
];

export function CategoriesSection() {
  return (
    <section id="categorias" className="scroll-mt-20 bg-background py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            Categorias populares
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Profissionais de todas as áreas — use tags ao publicar no feed
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <cat.icon className="text-primary" size={24} />
              </div>
              <span className="text-center text-sm font-medium text-foreground">
                {cat.name}
              </span>
              <span className="text-xs text-muted-foreground">{cat.count}+ vagas</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
