import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  footer,
}: {
  className?: string;
  /** Fundo claro no rodapé escuro para o wordmark navy aparecer bem */
  footer?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90",
        footer && "rounded-lg bg-white/95 p-2 shadow-sm",
        className
      )}
    >
      <Image
        src="/logo-nexwork.png"
        alt="NexWork — Organize seu trabalho. Evolua seu negócio."
        width={260}
        height={72}
        sizes="(max-width: 768px) 200px, 260px"
        className={cn(
          "h-8 w-auto object-contain object-left md:h-9",
          footer && "md:h-10"
        )}
        priority
      />
    </Link>
  );
}
