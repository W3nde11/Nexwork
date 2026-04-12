"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

/** Alinhado ao exemplo: duração total e fade nos últimos 500ms. */
const DURATION_MS = 2500;
const FADE_MS = 500;

export function SplashScreen() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), DURATION_MS - FADE_MS);
    const finishTimer = setTimeout(() => {
      router.replace("/");
    }, DURATION_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [router]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center bg-navy transition-opacity duration-500",
        fadeOut ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Glow — referência: um orbe primary com pulse */}
      <div className="absolute h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />

      {/* Mascote geométrico (raposa) — marca central da splash */}
      <Image
        src="/splash-fox.png"
        alt="NexWork — mascote"
        width={200}
        height={200}
        sizes="(max-width: 768px) 128px, 160px"
        priority
        className="relative z-10 h-32 w-32 object-contain drop-shadow-[0_0_28px_hsl(142_71%_45%/0.35)] animate-[float_2s_ease-in-out_infinite] md:h-40 md:w-40"
      />

      {/* Nome — Nex + Work com cores do tema */}
      <h1 className="relative z-10 mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
        <span className="text-primary-foreground">Nex</span>
        <span className="text-primary">Work</span>
      </h1>

      <p className="relative z-10 mt-2 text-center text-sm uppercase tracking-widest text-navy-foreground/75">
        Conectando talentos a oportunidades
      </p>

      {/* Barra de loading — keyframes como na referência */}
      <div className="relative z-10 mt-8 h-1 w-48 overflow-hidden rounded-full bg-muted/20">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            animation: `splashLoadBar ${DURATION_MS - FADE_MS}ms ease-out forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes splashLoadBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
