import Link from "next/link";
import { Logo } from "@/components/Logo";

export function LandingFooter() {
  return (
    <footer className="bg-navy text-navy-foreground">
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
                <Link
                  href="/cadastro"
                  className="transition-colors hover:text-navy-foreground"
                >
                  Criar conta
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-navy-foreground"
                >
                  Entrar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display font-semibold">Empresa</h4>
            <ul className="space-y-2 text-sm text-navy-foreground/60">
              <li>
                <span className="cursor-default">Sobre a NexWork</span>
              </li>
              <li>
                <span className="cursor-default">Termos de uso</span>
              </li>
              <li>
                <span className="cursor-default">Privacidade</span>
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
