"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  KeyRound,
  Loader2,
  Shield,
  UserX,
} from "lucide-react";
import { ChangePasswordModal } from "@/components/account/ChangePasswordModal";
import { DeleteAccountModal } from "@/components/account/DeleteAccountModal";
import { PermanencePolicyModal } from "@/components/account/PermanencePolicyModal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Profile = {
  email: string;
  name: string;
  company: string;
  phone: string;
  professionalTitle: string;
  bio: string;
  professionalExperience: string;
  interestAreas: string[];
  skills: string[];
  location: string;
  portfolio: string;
  avatar: string | null;
  hasPassword?: boolean;
};

const interestAreaOptions = [
  "Administração & Contabilidade",
  "Advogados & Leis",
  "Atendimento ao Consumidor",
  "Design & Criação",
  "Educação & Consultoria",
  "Engenharia & Arquitetura",
  "Escrita",
  "Fotografia & AudioVisual",
  "Suporte Administrativo",
  "Tradução",
  "Vendas & Marketing",
  "Web, Mobile & Software",
] as const;

export default function ContaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [personalEditing, setPersonalEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [bio, setBio] = useState("");
  const [professionalExperience, setProfessionalExperience] = useState("");
  const [interestAreas, setInterestAreas] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Não foi possível carregar o perfil." });
        return;
      }
      const u = data.user as Profile;
      setName(u.name);
      setEmail(u.email);
      setCompany(u.company ?? "");
      setPhone(u.phone ?? "");
      setProfessionalTitle(u.professionalTitle ?? "");
      setBio(u.bio ?? "");
      setProfessionalExperience(u.professionalExperience ?? "");
      setInterestAreas(u.interestAreas ?? []);
      setSkills((u.skills ?? []).join(", "));
      setLocation(u.location ?? "");
      setPortfolio(u.portfolio ?? "");
      setAvatar(u.avatar);
      setAvatarPreview(u.avatar);
      setHasPassword(Boolean(u.hasPassword));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "err", text: "Use uma imagem (JPG, PNG ou WebP)." });
      return;
    }
    if (file.size > 400 * 1024) {
      setMessage({ type: "err", text: "A imagem deve ter no máximo 400 KB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setAvatarPreview(data);
      setAvatar(data);
      setPersonalEditing(true);
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatar(null);
    setAvatarPreview(null);
    setPersonalEditing(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        professionalTitle: professionalTitle.trim(),
        bio: bio.trim(),
        professionalExperience: professionalExperience.trim(),
        interestAreas,
        skills: skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        location: location.trim(),
        portfolio: portfolio.trim(),
      };
      if (avatar === null && avatarPreview === null) {
        body.avatar = null;
      } else if (avatar !== null) {
        body.avatar = avatar;
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Não foi possível salvar." });
        return;
      }
      setMessage({ type: "ok", text: "Alterações salvas com sucesso." });
      setPersonalEditing(false);
      if (data.user?.avatar !== undefined) {
        setAvatar(data.user.avatar);
        setAvatarPreview(data.user.avatar);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center py-16">
        <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8 pb-16">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Minha conta</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Gerencie seus dados na NexWork, a foto que aparece nas conversas e sua senha de acesso.
        </p>
      </header>

      {message && (
        <p
          className={cn(
            "mb-6 rounded-lg px-4 py-3 text-sm",
            message.type === "ok"
              ? "border border-accent/40 bg-accent/10 text-foreground"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Foto */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Camera className="size-5 text-primary" aria-hidden />
            Foto de perfil
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Exibida nas conversas com profissionais e no ambiente logado. JPG, PNG ou WebP até 400
            KB.
          </p>
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-border bg-secondary/50 shadow-inner">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt=""
                  width={112}
                  height={112}
                  className="size-full object-cover"
                  unoptimized={avatarPreview.startsWith("data:")}
                />
              ) : (
                <span className="font-display text-2xl font-bold text-muted-foreground">
                  {name
                    .split(/\s+/)
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <label
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "cursor-pointer"
                )}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={onPickAvatar}
                />
                Alterar foto
              </label>
              {(avatarPreview || avatar) && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-destructive")}
                >
                  Remover foto
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Dados pessoais */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Dados pessoais</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Atualize nome, empresa e telefone. O e-mail é o login e não pode ser alterado aqui.
              </p>
            </div>
            {!personalEditing && (
              <button
                type="button"
                onClick={() => setPersonalEditing(true)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full shrink-0 sm:w-auto")}
              >
                Editar
              </button>
            )}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                Nome completo
              </label>
              <input
                id="name"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!personalEditing}
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-muted-foreground">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="h-11 w-full cursor-not-allowed rounded-lg border border-border bg-muted/50 px-4 text-muted-foreground"
              />
            </div>
            <div>
              <label htmlFor="company" className="mb-1 block text-sm font-medium text-foreground">
                Empresa
              </label>
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={!personalEditing}
                placeholder="Opcional"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">
                Telefone / WhatsApp
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!personalEditing}
                placeholder="Para contato e avisos no WhatsApp"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="professionalTitle" className="mb-1 block text-sm font-medium text-foreground">
                Título profissional
              </label>
              <input
                id="professionalTitle"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
                disabled={!personalEditing}
                placeholder="Ex.: Desenvolvedor Front-end"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="bio" className="mb-1 block text-sm font-medium text-foreground">
                Sobre mim
              </label>
              <textarea
                id="bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!personalEditing}
                placeholder="Conte um pouco sobre seu perfil, interesses e forma de trabalho."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="professionalExperience" className="mb-1 block text-sm font-medium text-foreground">
                Experiência profissional
              </label>
              <textarea
                id="professionalExperience"
                rows={5}
                value={professionalExperience}
                onChange={(e) => setProfessionalExperience(e.target.value)}
                disabled={!personalEditing}
                placeholder="Descreva suas experiências, projetos anteriores ou atuação profissional."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 block text-sm font-medium text-foreground">Áreas de interesse</p>
              <div className="grid gap-2 rounded-xl border border-border bg-background p-3 sm:grid-cols-2">
                {interestAreaOptions.map((area) => {
                  const checked = interestAreas.includes(area);

                  return (
                    <label key={area} className="flex cursor-pointer items-start gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!personalEditing}
                        onChange={() =>
                          setInterestAreas((current) =>
                            checked ? current.filter((item) => item !== area) : [...current, area]
                          )
                        }
                        className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary"
                      />
                      <span className="min-w-0 break-words">{area}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="skills" className="mb-1 block text-sm font-medium text-foreground">
                Habilidades
              </label>
              <input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                disabled={!personalEditing}
                placeholder="Ex.: React, TypeScript, Atendimento, Design"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">Separe as habilidades por vírgulas.</p>
            </div>
            <div>
              <label htmlFor="location" className="mb-1 block text-sm font-medium text-foreground">
                Local
              </label>
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!personalEditing}
                placeholder="Cidade, estado ou remoto"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="portfolio" className="mb-1 block text-sm font-medium text-foreground">
                Portfólio
              </label>
              <input
                id="portfolio"
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                disabled={!personalEditing}
                placeholder="https://seuportfolio.com"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {personalEditing && (
            <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:flex-wrap">
              <button
                type="submit"
                disabled={saving}
                className={cn(buttonVariants({ variant: "hero" }), "inline-flex w-full items-center gap-2 sm:w-auto")}
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Salvando…
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPersonalEditing(false);
                  load();
                }}
                className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
              >
                Cancelar
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <KeyRound className="size-5 text-primary" aria-hidden />
            Senha de acesso
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Usada junto com o e-mail para entrar na NexWork (contas que não usam só o Google).
          </p>
          {hasPassword ? (
            <button
              type="button"
              onClick={() => setPwdOpen(true)}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-4 inline-flex w-full items-center gap-2 sm:w-auto"
              )}
            >
              <KeyRound className="size-4 shrink-0" aria-hidden />
              Alterar senha de acesso
            </button>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Sua conta usa login com Google sem senha NexWork. Para criar uma senha, use{" "}
              <Link href="/recuperar-senha" className="font-medium text-primary hover:underline">
                recuperar senha
              </Link>{" "}
              com este e-mail — você receberá um link para definir a senha.
            </p>
          )}
        </section>

      </form>

      <section className="mt-12 rounded-2xl border border-border bg-navy/[0.03] p-6 md:p-8">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Shield className="size-5 text-navy" aria-hidden />
          Conta e permanência
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Entenda os benefícios de manter sua conta ativa como contratante ou inicie um processo
          seguro de exclusão (confirmação por e-mail com token ou, se aplicável, senha + palavra-chave).
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => setPolicyOpen(true)}
            className={cn(
              buttonVariants({ variant: "hero-outline", size: "default" }),
              "inline-flex w-full items-center justify-center gap-2 border-navy/25 text-navy hover:bg-navy/5 sm:w-auto"
            )}
          >
            <Shield className="size-4 shrink-0" />
            Exibir política de permanência
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "inline-flex w-full items-center justify-center gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 sm:w-auto"
            )}
          >
            <UserX className="size-4 shrink-0" />
            Excluir conta
          </button>
        </div>
      </section>

      <PermanencePolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
      <ChangePasswordModal
        open={pwdOpen}
        onClose={() => setPwdOpen(false)}
        onSuccess={() =>
          setMessage({ type: "ok", text: "Senha alterada com sucesso." })
        }
      />
      <DeleteAccountModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        hasPassword={hasPassword}
        onDeleted={() => {
          setDeleteOpen(false);
          router.push("/");
          router.refresh();
        }}
      />
    </div>
  );
}
