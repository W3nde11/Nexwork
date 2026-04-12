import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession, setAuthCookie, signToken } from "@/lib/auth";
import type { IUser } from "@/models/User";
import { User } from "@/models/User";

const MAX_AVATAR_CHARS = 650_000;

const patchSchema = z
  .object({
    name: z.string().min(2).max(120).optional(),
    company: z.string().max(200).optional(),
    phone: z.string().max(30).optional(),
    avatar: z.string().max(MAX_AVATAR_CHARS).nullable().optional(),
    notificationChannels: z
      .object({
        app: z.boolean(),
        email: z.boolean(),
        whatsapp: z.boolean(),
      })
      .optional(),
    notificationFrequency: z
      .enum(["per_event", "daily", "scheduled"])
      .optional(),
    notificationScheduledTime: z
      .union([z.string().regex(/^\d{2}:\d{2}$/), z.null()])
      .optional(),
  })
  .strict();

function serializeUser(user: IUser) {
  const ch = user.notificationChannels;
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    company: user.company ?? "",
    phone: user.phone ?? "",
    avatar: user.avatar ?? null,
    hasPassword: Boolean(user.passwordHash),
    notificationChannels: {
      app: ch?.app ?? true,
      email: ch?.email ?? true,
      whatsapp: ch?.whatsapp ?? false,
    },
    notificationFrequency: user.notificationFrequency ?? "per_event",
    notificationScheduledTime: user.notificationScheduledTime ?? null,
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  await connectDB();
  const user = await User.findById(session.sub).lean<IUser | null>();
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ user: serializeUser(user as IUser) });
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const json = await req.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;
    await connectDB();

    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name.trim();
    if (data.company !== undefined) update.company = data.company.trim();
    if (data.phone !== undefined) update.phone = data.phone.trim();
    if (data.avatar !== undefined) update.avatar = data.avatar;
    if (data.notificationChannels !== undefined) {
      update.notificationChannels = data.notificationChannels;
    }
    if (data.notificationFrequency !== undefined) {
      update.notificationFrequency = data.notificationFrequency;
    }
    if (data.notificationScheduledTime !== undefined) {
      update.notificationScheduledTime = data.notificationScheduledTime;
    }

    if (
      data.notificationFrequency === "per_event" ||
      data.notificationFrequency === "daily"
    ) {
      update.notificationScheduledTime = null;
    }

    const user = await User.findByIdAndUpdate(session.sub, { $set: update }, { new: true }).lean<
      IUser | null
    >();
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    });
    await setAuthCookie(token);

    return NextResponse.json({
      user: serializeUser(user as IUser),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao atualizar perfil." }, { status: 500 });
  }
}
