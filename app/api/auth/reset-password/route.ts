import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { hashPassword } from "@/lib/password-hash";
import { passwordSchema } from "@/lib/password-policy";
import { hashResetToken } from "@/lib/password-reset";
import { PasswordResetToken } from "@/models/PasswordResetToken";
import { User } from "@/models/User";

const schema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Token ou senha inválidos" },
        { status: 400 }
      );
    }
    const { token, password } = parsed.data;
    const tokenHash = hashResetToken(token);

    await connectDB();
    const record = await PasswordResetToken.findOne({ tokenHash });
    if (!record || record.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Link inválido ou expirado. Solicite uma nova recuperação." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    await User.updateOne({ _id: record.userId }, { $set: { passwordHash } });
    await PasswordResetToken.deleteMany({ userId: record.userId });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível redefinir a senha." },
      { status: 500 }
    );
  }
}
