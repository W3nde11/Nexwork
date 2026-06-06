"use client";

import { useMemo, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const publicationCategories = [
  "Tecnologia",
  "Design",
  "Marketing",
  "Construção",
  "Educação",
  "Serviços Domésticos",
  "Audiovisual",
  "Consultoria",
  "Outros",
] as const;

const skillOptions = [
  ".NET Framework",
  ".NET para Web",
  "Administração",
  "Administração de Banco de Dados",
  "Administração de Redes",
  "Adobe After Effects",
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Adobe Premiere",
  "Adobe XD",
  "Agilidade",
  "AJAX",
  "Algoritmo",
  "Amazon Web Services",
  "Análise de Dados",
  "Análise de Negócios",
  "Análise de Requisitos",
  "Análise de Sistemas",
  "Android",
  "Angular",
  "Aplicações Desktop",
  "Apps para Smart Phone/Tablet",
  "Aprendizado de Máquina (ML)",
  "Arquitetura de Software",
  "Atendimento ao Cliente",
  "AutoCAD",
  "Automação de Testes",
  "Banco De Dados",
  "Big Data",
  "Blog",
  "Bootstrap",
  "Branding",
  "Business Intelligence",
  "Chatbot",
  "Ciência de Dados",
  "Cloud Computing",
  "Comunicação Digital",
  "Consultoria",
  "Conteúdo Institucional",
  "Copywriting",
  "CSS",
  "CSS3",
  "Design",
  "Design de App",
  "Design de Interface",
  "Design de Logotipo",
  "Design de Website",
  "Design Gráfico",
  "DevOps",
  "Django",
  "Docker",
  "Edição de Imagens",
  "Edição de Textos",
  "Edição de Vídeo",
  "Email Marketing",
  "Engenharia de Software",
  "Escrita Criativa",
  "Escrita Técnica",
  "Excel",
  "Figma",
  "Flutter",
  "Front-End",
  "Full Stack",
  "Git",
  "GitHub",
  "Google ADS",
  "Google Analytics",
  "HTML",
  "HTML5",
  "Identidade Visual",
  "Instagram ADS",
  "Inteligência Artificial",
  "iOS",
  "Java",
  "Javascript",
  "Javascript ES6",
  "JSON",
  "Kotlin",
  "Kubernetes",
  "Landing Pages",
  "Laravel",
  "Linux",
  "Marketing",
  "Marketing Digital",
  "MongoDB",
  "Motion Design",
  "MySQL",
  "NodeJS",
  "Photoshop",
  "PHP",
  "PostgreSQL",
  "Power BI",
  "Python",
  "QA / Testes",
  "React",
  "React Native",
  "Redação",
  "Redação SEO",
  "SEO",
  "Social Media",
  "SQL",
  "Tailwind CSS",
  "Typescript",
  "UI Design",
  "UX Design",
  "Vue.JS",
  "Web Design",
  "Wordpress",
] as const;

const experienceOptions = [
  {
    value: "iniciante",
    title: "Iniciante",
    description: "Estou a procura de freelancers com os menores valores.",
  },
  {
    value: "intermediario",
    title: "Intermediário",
    description: "Estou a procura de uma combinação de experiência e valor.",
  },
  {
    value: "especialista",
    title: "Especialista",
    description: "Estou disposto a pagar valores mais elevados para freelancers experientes.",
  },
] as const;

type ExperienceLevel = (typeof experienceOptions)[number]["value"];

type PublishProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export function PublishProjectModal({ open, onClose, onCreated }: PublishProjectModalProps) {
  const [projectCategory, setProjectCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("intermediario");
  const [proposalDays, setProposalDays] = useState("30");
  const [visibility, setVisibility] = useState<"publico" | "privado">("publico");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredSkillOptions = useMemo(() => {
    const term = skillSearch.trim().toLowerCase();
    return skillOptions
      .filter((skill) => !term || skill.toLowerCase().includes(term))
      .slice(0, 80);
  }, [skillSearch]);

  if (!open) return null;

  function toggleSkill(skill: string) {
    setSelectedSkills((current) => {
      if (current.includes(skill)) return current.filter((item) => item !== skill);
      if (current.length >= 5) return current;
      return [...current, skill];
    });
  }

  function resetForm() {
    setProjectCategory("");
    setTitle("");
    setDescription("");
    setAttachments([]);
    setSkillSearch("");
    setSelectedSkills([]);
    setExperienceLevel("intermediario");
    setProposalDays("30");
    setVisibility("publico");
  }

  async function createJob(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const proposalDaysValue = Number(proposalDays);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: projectCategory,
          title,
          description,
          tags: [projectCategory, ...selectedSkills].filter(Boolean),
          attachments,
          experienceLevel,
          proposalDays: Number.isFinite(proposalDaysValue) ? proposalDaysValue : 30,
          visibility,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao publicar.");
        return;
      }
      resetForm();
      setSuccess("Publicação realizada com sucesso!");
      onCreated?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/60 p-3 py-6 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-2xl sm:max-h-[90vh] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold text-foreground">Publique um projeto</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Descreva o trabalho e gere um link para receber candidatos pelo chat.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Fechar publicação"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {error && <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {success && <p className="mt-4 rounded-lg bg-accent/10 px-4 py-3 text-sm text-accent">{success}</p>}

        <form onSubmit={createJob} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Escolha uma categoria</label>
            <select
              required
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecione uma categoria</option>
              {publicationCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <label className="block text-sm font-medium text-foreground">Dê um nome para o trabalho</label>
              <span className="text-xs text-muted-foreground">{75 - title.length}</span>
            </div>
            <input
              required
              minLength={3}
              maxLength={75}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex. Redator para blog de tecnologia"
            />
          </div>

          <div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <label className="block text-sm font-medium text-foreground">
                Descreva o trabalho a ser feito
              </label>
              <span className="text-xs text-muted-foreground">{5000 - description.length}</span>
            </div>
            <textarea
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Escopo, prazo, formato de contratação..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Anexe um arquivo (Opcional)</label>
            <label className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background px-4 py-5 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5">
              <Paperclip className="mb-2 size-5 text-primary" aria-hidden />
              <span className="font-medium text-foreground">Adicionar arquivos</span>
              <span className="mt-1 text-xs">Ou se preferir arraste seus arquivos aqui.</span>
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={(e) => setAttachments(Array.from(e.target.files ?? []).map((file) => file.name))}
              />
            </label>
            {attachments.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {attachments.map((file) => (
                  <li key={file} className="flex min-w-0 items-center justify-between gap-2 rounded-md bg-secondary px-2 py-1">
                    <span className="min-w-0 truncate">{file}</span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setAttachments((current) => current.filter((item) => item !== file))}
                      aria-label={`Remover ${file}`}
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Quais habilidades são desejadas? (Opcional)
            </label>
            <input
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Busque por uma habilidade"
            />
            <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border bg-background p-2">
              {filteredSkillOptions.map((skill) => {
                const checked = selectedSkills.includes(skill);
                const disabled = !checked && selectedSkills.length >= 5;

                return (
                  <label
                    key={skill}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                      checked ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleSkill(skill)}
                      className="mt-0.5 size-3.5 shrink-0 accent-primary"
                    />
                    <span className="min-w-0 break-words">{skill}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-2">
              <p className="text-xs font-medium text-foreground">Selecionadas (max 5)</p>
              {selectedSkills.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className="inline-flex max-w-full items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      <span className="min-w-0 truncate">{skill}</span>
                      <X className="size-3" aria-hidden />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">Nenhuma habilidade selecionada.</p>
              )}
            </div>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-foreground">Nível de experiência desejado</legend>
            <div className="mt-2 space-y-2">
              {experienceOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "block cursor-pointer rounded-lg border p-3 transition-colors",
                    experienceLevel === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <span className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={option.value}
                      checked={experienceLevel === option.value}
                      onChange={() => setExperienceLevel(option.value)}
                      className="mt-1 accent-primary"
                    />
                    <span>
                      <span className="block text-sm font-medium text-foreground">{option.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Durante quantos dias você quer receber propostas?
            </label>
            <input
              required
              type="number"
              min={1}
              max={90}
              value={proposalDays}
              onChange={(e) => setProposalDays(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-foreground">Visibilidade do projeto</legend>
            <div className="mt-2 grid gap-2">
              {[
                {
                  value: "publico",
                  title: "Público",
                  description: "Visível para todos os profissionais.",
                },
                {
                  value: "privado",
                  title: "Privado",
                  description: "Apenas os freelancers que forem convidados poderão se candidatar.",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "cursor-pointer rounded-lg border p-3 transition-colors",
                    visibility === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <span className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="visibility"
                      value={option.value}
                      checked={visibility === option.value}
                      onChange={() => setVisibility(option.value as "publico" | "privado")}
                      className="mt-1 accent-primary"
                    />
                    <span>
                      <span className="block text-sm font-medium text-foreground">{option.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{option.description}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={saving}
            className={cn(buttonVariants({ variant: "success" }), "w-full")}
          >
            {saving ? "Publicando..." : "Publicar projeto"}
          </button>
        </form>
      </div>
    </div>
  );
}
