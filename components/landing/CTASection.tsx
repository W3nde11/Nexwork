import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-navy-foreground">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container relative space-y-8 text-center">
        <h2 className="font-display text-3xl font-bold md:text-5xl">
          O que você quer fazer <span className="text-gradient">hoje</span>?
        </h2>
        <p className="mx-auto max-w-md text-lg text-navy-foreground/70">
          Comece gratuitamente, publique oportunidades e organize o contato com quem se
          interessar.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/cadastro"
            className={cn(buttonVariants({ variant: "hero", size: "lg" }), "gap-2")}
          >
            Criar conta <ArrowRight size={18} />
          </Link>
          <Link
            href="/cadastro"
            className={cn(
              buttonVariants({ variant: "success", size: "lg" }),
              "gap-2"
            )}
          >
            Publicar trabalho <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
