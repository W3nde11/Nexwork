import { getAppBaseUrl } from "@/lib/password-reset";

/**
 * Envia e-mail de redefinição via Resend quando RESEND_API_KEY está definido.
 * Em desenvolvimento, sem API key, registra o link no console do servidor (não exponha em produção).
 */
export async function sendPasswordResetEmail(to: string, resetPathWithToken: string) {
  const base = getAppBaseUrl();
  const resetUrl = `${base}${resetPathWithToken.startsWith("/") ? "" : "/"}${resetPathWithToken}`;
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[password-reset] RESEND_API_KEY não configurado. Link de teste (dev apenas):",
        resetUrl
      );
    }
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Redefinição de senha — NexWork",
      html: `<p>Recebemos um pedido para redefinir sua senha.</p>
<p>Este link expira em 1 hora:</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>Se você não pediu, ignore este e-mail.</p>`,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Falha ao enviar e-mail: ${res.status} ${text}`);
  }
}
