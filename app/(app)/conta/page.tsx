"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Camera,
  KeyRound,
  Loader2,
  Smartphone,
  Mail,
  MessageCircle,
  Shield,
  UserX,
} from "lucide-react";
import { ChangePasswordModal } from "@/components/account/ChangePasswordModal";
import { DeleteAccountModal } from "@/components/account/DeleteAccountModal";
import { PermanencePolicyModal } from "@/components/account/PermanencePolicyModal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Channels = { app: boolean; email: boolean; whatsapp: boolean };
type Frequency = "per_event" | "daily" | "scheduled";

type Profile = {
  email: string;
  name: string;
  company: string;
  phone: string;
  avatar: string | null;
  hasPassword?: boolean;
  notificationChannels: Channels;
  notificationFrequency: Frequency;
  notificationScheduledTime: string | null;
};

const defaultChannels: Channels = { app: true, email: true, whatsapp: false };

export default function ContaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channels>(defaultChannels);
  const [frequency, setFrequency] = useState<Frequency>("per_event");
  const [scheduledTime, setScheduledTime] = useState("09:00");

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
      setAvatar(u.avatar);
      setAvatarPreview(u.avatar);
      setChannels(u.notificationChannels ?? defaultChannels);
      setFrequency(u.notificationFrequency ?? "per_event");
      setScheduledTime(u.notificationScheduledTime ?? "09:00");
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
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatar(null);
    setAvatarPreview(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (frequency === "scheduled" && !/^\d{2}:\d{2}$/.test(scheduledTime)) {
      setMessage({ type: "err", text: "Informe um horário válido (HH:mm)." });
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        notificationChannels: channels,
        notificationFrequency: frequency,
        notificationScheduledTime:
          frequency === "scheduled" ? scheduledTime : null,
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
          Gerencie seus dados na NexWork, a foto que aparece nas conversas e como você prefere ser
          avisado sobre mensagens e atualizações das suas publicações.
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
          <h2 className="font-display text-lg font-semibold text-foreground">Dados pessoais</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Atualize nome, empresa e telefone. O e-mail é o login e não pode ser alterado aqui.
          </p>
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
                placeholder="Para contato e avisos no WhatsApp"
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <p className="text-sm font-medium text-foreground">Senha de acesso</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Usada junto com o e-mail para entrar na NexWork (contas que não usam só o Google).
            </p>
            {hasPassword ? (
              <button
                type="button"
                onClick={() => setPwdOpen(true)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-3 inline-flex items-center gap-2"
                )}
              >
                <KeyRound className="size-4 shrink-0" aria-hidden />
                Alterar senha de acesso
              </button>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Sua conta usa login com Google sem senha NexWork. Para criar uma senha, use{" "}
                <Link href="/recuperar-senha" className="font-medium text-primary hover:underline">
                  recuperar senha
                </Link>{" "}
                com este e-mail — você receberá um link para definir a senha.
              </p>
            )}
          </div>
        </section>

        {/* Notificações */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Bell className="size-5 text-accent" aria-hidden />
            Notificações
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha onde e com que frequência quer receber lembretes sobre mensagens e atividade nas
            suas vagas.
          </p>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-foreground">Canais</p>
            <div className="space-y-2 rounded-xl border border-border/80 bg-secondary/20 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={channels.app}
                  onChange={(e) =>
                    setChannels((c) => ({ ...c, app: e.target.checked }))
                  }
                  className="size-4 rounded border-border text-primary focus:ring-primary"
                />
                <Smartphone className="size-4 text-primary shrink-0" aria-hidden />
                <span className="text-sm text-foreground">App / painel NexWork</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={channels.email}
                  onChange={(e) =>
                    setChannels((c) => ({ ...c, email: e.target.checked }))
                  }
                  className="size-4 rounded border-border text-primary focus:ring-primary"
                />
                <Mail className="size-4 text-primary shrink-0" aria-hidden />
                <span className="text-sm text-foreground">E-mail</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={channels.whatsapp}
                  onChange={(e) =>
                    setChannels((c) => ({ ...c, whatsapp: e.target.checked }))
                  }
                  className="size-4 rounded border-border text-primary focus:ring-primary"
                />
                <MessageCircle className="size-4 text-accent shrink-0" aria-hidden />
                <span className="text-sm text-foreground">WhatsApp</span>
              </label>
            </div>
            {channels.whatsapp && !phone.trim() && (
              <p className="text-xs text-amber-800">
                Informe um telefone acima para podermos enviar avisos pelo WhatsApp.
              </p>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-sm font-medium text-foreground">Frequência</p>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-2 hover:bg-secondary/40 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === "per_event"}
                  onChange={() => setFrequency("per_event")}
                  className="mt-1 size-4 border-border text-primary focus:ring-primary"
                />
                <span>
                  <span className="block text-sm font-medium text-foreground">Por evento</span>
                  <span className="text-xs text-muted-foreground">
                    Aviso na hora — nova mensagem no chat, candidato interessado, etc.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-2 hover:bg-secondary/40 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === "daily"}
                  onChange={() => setFrequency("daily")}
                  className="mt-1 size-4 border-border text-primary focus:ring-primary"
                />
                <span>
                  <span className="block text-sm font-medium text-foreground">Diário</span>
                  <span className="text-xs text-muted-foreground">
                    Um resumo por dia com o que aconteceu nas suas publicações e conversas.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-2 hover:bg-secondary/40 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === "scheduled"}
                  onChange={() => setFrequency("scheduled")}
                  className="mt-1 size-4 border-border text-primary focus:ring-primary"
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-foreground">Programado</span>
                  <span className="text-xs text-muted-foreground">
                    Receba um resumo no horário que preferir.
                  </span>
                  {frequency === "scheduled" && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label htmlFor="sched" className="text-xs text-muted-foreground">
                        Horário
                      </label>
                      <input
                        id="sched"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </span>
              </label>
            </div>
          </div>
        </section>

        <div className="mt-10 flex justify-start border-t border-border pt-6">
          <button
            type="submit"
            disabled={saving}
            className={cn(
              buttonVariants({ variant: "hero", size: "lg" }),
              "inline-flex items-center justify-center gap-2"
            )}
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
        </div>
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
              "inline-flex items-center justify-center gap-2 border-navy/25 text-navy hover:bg-navy/5"
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
              "inline-flex items-center justify-center gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
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
