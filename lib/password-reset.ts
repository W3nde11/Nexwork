import { createHash, randomBytes } from "crypto";

/** Tempo de validade do link de recuperação (1 hora). */
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

/** Número de bytes do token opaco antes de codificar (32 bytes = 256 bits). */
const TOKEN_BYTES = 32;

export function hashResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}

/**
 * Gera um token aleatório em base64url (seguro para URL) e o hash para persistência.
 * O valor em texto claro só é enviado por e-mail; no banco fica apenas o hash.
 */
export function generateOpaqueResetToken(): { rawToken: string; tokenHash: string } {
  const rawToken = randomBytes(TOKEN_BYTES).toString("base64url");
  return { rawToken, tokenHash: hashResetToken(rawToken) };
}

export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
