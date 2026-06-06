import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";
import { isOldEnoughForSignup, MINIMUM_SIGNUP_AGE, parseBirthDate } from "@/lib/birth-date-policy";
import { hashPassword } from "@/lib/password-hash";
import { passwordSchema } from "@/lib/password-policy";
import { User } from "@/models/User";

const schema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  name: z.string().min(2),
  company: z.string().optional(),
  birthDate: z.string().refine(isOldEnoughForSignup, {
    message: `Você precisa ter pelo menos ${MINIMUM_SIGNUP_AGE} anos para criar uma conta.`,
  }),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    await connectDB();
    const { email, password, name, company, birthDate } = parsed.data;
    const parsedBirthDate = parseBirthDate(birthDate);
    if (!parsedBirthDate) {
      return NextResponse.json({ error: "Data de nascimento inválida" }, { status: 400 });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "E-mail já cadastrado" },
        { status: 409 }
      );
    }
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      name,
      company,
      birthDate: parsedBirthDate,
    });
    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    });
    await setAuthCookie(token);
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        company: user.company,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao registrar. Verifique MONGODB_URI e JWT_SECRET." },
      { status: 500 }
    );
  }
}
