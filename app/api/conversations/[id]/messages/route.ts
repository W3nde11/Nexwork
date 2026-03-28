import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Conversation } from "@/models/Conversation";
import type { IMessage } from "@/models/Message";
import { Message } from "@/models/Message";

const postSchema = z.object({
  body: z.string().min(1).max(8000),
});

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  try {
    await connectDB();
    const conv = await Conversation.findById(id);
    if (!conv || conv.contractorId.toString() !== session.sub) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    const messages = await Message.find({ conversationId: conv._id })
      .sort({ createdAt: 1 })
      .lean<IMessage[]>();
    return NextResponse.json({
      conversationId: conv._id.toString(),
      messages: messages.map((m) => ({
        id: String(m._id),
        sender: m.sender,
        body: m.body,
        createdAt: m.createdAt,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  const json = await req.json();
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
  }
  try {
    await connectDB();
    const conv = await Conversation.findById(id);
    if (!conv || conv.contractorId.toString() !== session.sub) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    const msg = await Message.create({
      conversationId: conv._id,
      sender: "contractor",
      body: parsed.data.body,
    });
    conv.updatedAt = new Date();
    await conv.save();
    return NextResponse.json({
      message: {
        id: msg._id.toString(),
        sender: "contractor" as const,
        body: msg.body,
        createdAt: msg.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao enviar" }, { status: 500 });
  }
}
