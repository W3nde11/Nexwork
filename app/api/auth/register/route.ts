import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  company: z.string().optional(),
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
    const { email, password, name, company } = parsed.data;
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "E-mail já cadastrado" },
        { status: 409 }
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      name,
      company,
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
