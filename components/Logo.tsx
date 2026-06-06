import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  footer,
  href = "/",
}: {
  className?: string;
  footer?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex max-w-[48vw] items-center transition-opacity hover:opacity-90 sm:max-w-none",
        className
      )}
    >
      <Image
        src="/logo-nexwork.png"
        alt="NexWork — Organize seu trabalho. Evolua seu negócio."
        width={584}
        height={122}
        sizes="(max-width: 768px) 180px, 220px"
        className={cn(
          "h-8 w-auto rounded-lg object-contain object-left md:h-9",
          footer && "md:h-10"
        )}
        priority
      />
    </Link>
  );
}
