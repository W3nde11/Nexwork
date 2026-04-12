import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

/** Texto único para API e formulários. */
export const PASSWORD_POLICY_DESCRIPTION =
  "Mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.";

export function isPasswordPolicyCompliant(password: string): boolean {
  if (password.length < PASSWORD_MIN_LENGTH) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  /** Caractere especial: não letra, não dígito e não espaço em branco */
  if (!/[^A-Za-z0-9\s]/.test(password)) return false;
  return true;
}

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, PASSWORD_POLICY_DESCRIPTION)
  .max(128, "Senha muito longa.")
  .refine(isPasswordPolicyCompliant, { message: PASSWORD_POLICY_DESCRIPTION });
