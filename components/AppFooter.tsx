import Link from "next/link";
import { Logo } from "@/components/Logo";

export function AppFooter() {
  return (
    <footer className="mt-auto bg-navy text-navy-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4">
              <Logo footer />
            </div>
            <p className="text-sm text-navy-foreground/60">
              Conectando talentos a oportunidades — publique vagas e converse com
              interessados em um só lugar.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-display font-semibold">Plataforma</h4>
            <ul className="space-y-2 text-sm text-navy-foreground/60">
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-navy-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trabalhos" className="transition-colors hover:text-navy-foreground">
                  Trabalhos
                </Link>
              </li>
              <li>
                <Link href="/profissionais" className="transition-colors hover:text-navy-foreground">
                  Profissionais
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display font-semibold">Empresa</h4>
            <ul className="space-y-2 text-sm text-navy-foreground/60">
              <li>
                <Link href="/sobre" className="transition-colors hover:text-navy-foreground">
                  Sobre a NexWork
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="transition-colors hover:text-navy-foreground">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="transition-colors hover:text-navy-foreground">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display font-semibold">Contato</h4>
            <ul className="space-y-2 text-sm text-navy-foreground/60">
              <li>contato@nexwork.com</li>
              <li>
                <a
                  href="https://www.instagram.com/nex_work_?igsh=a2hlbW5rNWVyNDJh&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-navy-foreground"
                >
                  Instagram (@nex_work_)
                </a>
              </li>
              <li>Suporte aos contratantes</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-navy-foreground/10 pt-8 text-center text-sm text-navy-foreground/40">
          © {new Date().getFullYear()} NexWork. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
