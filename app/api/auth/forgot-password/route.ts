import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import {
  RESET_TOKEN_TTL_MS,
  generateOpaqueResetToken,
} from "@/lib/password-reset";
import { PasswordResetToken } from "@/models/PasswordResetToken";
import { User } from "@/models/User";

const schema = z.object({
  email: z.string().email(),
});

const GENERIC_MESSAGE =
  "Se esse e-mail estiver cadastrado, você receberá um link para redefinir a senha.";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }
    await connectDB();
    const email = parsed.data.email.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (user) {
      await PasswordResetToken.deleteMany({ userId: user._id });
      const { rawToken, tokenHash } = generateOpaqueResetToken();
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt,
      });
      const path = `/redefinir-senha?token=${encodeURIComponent(rawToken)}`;
      await sendPasswordResetEmail(user.email, path);
    }

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível processar o pedido. Tente novamente." },
      { status: 500 }
    );
  }
}
