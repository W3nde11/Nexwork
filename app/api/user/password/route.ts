import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password-hash";
import { passwordSchema } from "@/lib/password-policy";
import { User } from "@/models/User";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Informe a senha atual e uma nova senha que atenda à política de segurança." },
        { status: 400 }
      );
    }
    const { currentPassword, newPassword } = parsed.data;
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "A nova senha deve ser diferente da atual." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.sub);
    if (!user?.passwordHash) {
      return NextResponse.json(
        {
          error:
            "Esta conta não possui senha NexWork (ex.: login com Google). Use «Esqueceu a senha?» no login para definir uma senha.",
        },
        { status: 400 }
      );
    }

    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Senha atual incorreta." }, { status: 401 });
    }

    const passwordHash = await hashPassword(newPassword);
    await User.updateOne({ _id: user._id }, { $set: { passwordHash } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Não foi possível alterar a senha." }, { status: 500 });
  }
}
