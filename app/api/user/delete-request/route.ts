import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { DELETE_ACCOUNT_TOKEN_TTL_MS } from "@/lib/account-deletion";
import { sendAccountDeletionEmail } from "@/lib/email";
import { generateOpaqueResetToken } from "@/lib/password-reset";
import { AccountDeletionToken } from "@/models/AccountDeletionToken";
import { User } from "@/models/User";

const GENERIC =
  "Se o e-mail estiver cadastrado, você receberá um link para confirmar a exclusão.";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    await connectDB();
    const user = await User.findById(session.sub);
    if (!user) {
      return NextResponse.json({ message: GENERIC });
    }

    await AccountDeletionToken.deleteMany({ userId: user._id });
    const { rawToken, tokenHash } = generateOpaqueResetToken();
    const expiresAt = new Date(Date.now() + DELETE_ACCOUNT_TOKEN_TTL_MS);
    await AccountDeletionToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const path = `/conta/excluir?token=${encodeURIComponent(rawToken)}`;
    await sendAccountDeletionEmail(user.email, path);

    return NextResponse.json({
      message:
        "Enviamos um link seguro para o seu e-mail. Abra-o em até 24 horas para confirmar a exclusão.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível enviar o e-mail. Tente novamente." },
      { status: 500 }
    );
  }
}
