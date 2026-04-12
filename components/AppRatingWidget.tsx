"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";

const STORAGE_KEY = "nexwork_app_rating_submitted";

export function AppRatingWidget() {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  function submit() {
    setErr("");
    if (stars < 1) {
      setErr("Selecione de 1 a 5 estrelas.");
      return;
    }
    try {
      const payload = {
        stars,
        comment: comment.trim(),
        at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setDone(true);
      setComment("");
    } catch {
      setErr("Não foi possível salvar localmente.");
    }
  }

  const display = hover || stars;

  return (
    <div className="w-full text-center">
      <h3 className="mb-1.5 font-display text-xs font-semibold uppercase tracking-wide text-foreground">
        Avalie o app
      </h3>
      <p className="mx-auto max-w-[14rem] text-[11px] leading-snug text-muted-foreground">
        De 1 a 5 estrelas e comentário opcional.
      </p>
      <div className="mt-2 w-full max-w-sm rounded-lg border border-border bg-card/50 p-3">
        {done ? (
          <p className="text-xs text-accent">Obrigado pela sua avaliação!</p>
        ) : (
        <>
          <div className="flex flex-row flex-wrap items-start justify-center gap-2 sm:gap-3">
            <div
              className="flex shrink-0 items-center gap-0.5 pt-0.5"
              role="group"
              aria-label="Nota de 1 a 5 estrelas"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="rounded p-0.5 text-amber-500 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setStars(n)}
                  onMouseEnter={() => setHover(n)}
                  aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                >
                  <Star
                    className={cn(
                      "size-5 sm:size-6",
                      n <= display ? "fill-current" : "fill-none opacity-35"
                    )}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comentário (opcional)"
              rows={2}
              maxLength={500}
              className="min-h-[2.75rem] w-full min-w-0 max-w-full flex-1 basis-[12rem] resize-none rounded-md border border-border bg-background px-2 py-1.5 text-left text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:min-h-[3.25rem]"
            />
          </div>
          {err && <p className="mt-1.5 text-center text-[11px] text-destructive">{err}</p>}
          <div className="mt-2 flex justify-center">
            <button
              type="button"
              onClick={submit}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "h-8 text-xs")}
            >
              Enviar
            </button>
          </div>
        </>
        )}
      </div>
    </div>
  );
}
