import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-nw-white via-white to-nw-purple/5">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-nw-blue/90 hover:text-nw-blue"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-lg bg-nw-purple px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-nw-purple/90"
          >
            Sou contratante
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:px-6 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-8">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-nw-green/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-nw-blue">
              Plataforma NexWork
            </p>
            <h1 className="text-balance font-sans text-4xl font-bold leading-tight text-nw-blue md:text-5xl">
              Conecte talentos independentes às suas oportunidades
            </h1>
            <p className="mt-5 max-w-xl font-inter text-lg text-nw-blue/75">
              Publique trabalhos, organize conversas e responda interessados em um
              só lugar — interface limpa, poucos cliques e foco em agilidade.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/cadastro"
                className="rounded-xl bg-nw-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-nw-blue/20 transition hover:bg-nw-blue/90"
              >
                Criar conta gratuita
              </Link>
              <Link
                href="/login"
                className="rounded-xl border-2 border-nw-purple/40 px-6 py-3 text-sm font-semibold text-nw-purple transition hover:bg-nw-purple/5"
              >
                Já tenho conta
              </Link>
            </div>
            <ul className="mt-10 grid gap-3 font-inter text-sm text-nw-gray sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-nw-green" />
                Feed de vagas em cards, responsivo
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-nw-purple" />
                Chat para contato com interessados
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-nw-blue" />
                Transparência e simplicidade no dia a dia
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-nw-green" />
                Profissionais entram pelo link da vaga — sem painel extra
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-nw-purple/20 via-transparent to-nw-green/20 blur-2xl" />
            <div className="relative rounded-2xl border border-nw-blue/10 bg-white p-6 shadow-card md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-nw-gray">
                Identidade
              </p>
              <p className="mt-2 font-inter text-sm text-nw-blue/80">
                Azul (#061E4C) confiança · Roxo (#6C2AD5) inovação · Verde
                (#21C45D) crescimento
              </p>
              <div className="mt-6 space-y-3 rounded-xl bg-nw-white p-4 ring-1 ring-nw-blue/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-nw-gray">Nova oportunidade</span>
                  <span className="rounded-md bg-nw-green/15 px-2 py-0.5 text-xs font-medium text-nw-blue">
                    Publicada
                  </span>
                </div>
                <p className="font-medium text-nw-blue">Designer UX — projeto pontual</p>
                <p className="font-inter text-xs text-nw-gray line-clamp-2">
                  Briefing e alinhamento por chat; candidatos usam o link público da
                  vaga para falar com você.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-nw-blue/10 py-8 text-center font-inter text-sm text-nw-gray">
        © {new Date().getFullYear()} NexWork — Missão: conectar autônomos e
        contratantes com eficiência.
      </footer>
    </div>
  );
}
