import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { clearAuthCookie, getSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password-hash";
import { hashResetToken } from "@/lib/password-reset";
import { purgeUserData } from "@/lib/purge-user";
import { AccountDeletionToken } from "@/models/AccountDeletionToken";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const token = typeof json.token === "string" ? json.token.trim() : "";
    const password = typeof json.password === "string" ? json.password : "";
    const phrase = typeof json.phrase === "string" ? json.phrase.trim() : "";

    await connectDB();

    if (token.length > 0) {
      const tokenHash = hashResetToken(token);
      const record = await AccountDeletionToken.findOne({ tokenHash });
      if (!record || record.expiresAt.getTime() < Date.now()) {
        return NextResponse.json(
          { error: "Link inválido ou expirado. Solicite um novo e-mail em Minha conta." },
          { status: 400 }
        );
      }
      const userId = record.userId as mongoose.Types.ObjectId;
      await purgeUserData(userId);

      const session = await getSession();
      if (session?.sub === userId.toString()) {
        await clearAuthCookie();
      }
      return NextResponse.json({ ok: true });
    }

    if (password.length > 0 && phrase === "EXCLUIR") {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
      const user = await User.findById(session.sub);
      if (!user) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
      }
      if (!user.passwordHash) {
        return NextResponse.json(
          {
            error:
              "Conta sem senha (ex.: login com Google). Use o link enviado por e-mail para excluir.",
          },
          { status: 400 }
        );
      }
      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) {
        return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
      }
      await purgeUserData(user._id as mongoose.Types.ObjectId);
      await clearAuthCookie();
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      {
        error:
          "Envie o token do link recebido por e-mail ou senha atual junto com a palavra EXCLUIR.",
      },
      { status: 400 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao processar exclusão." }, { status: 500 });
  }
}
