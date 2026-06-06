import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Conversation } from "@/models/Conversation";
import type { IMessage } from "@/models/Message";
import { Message } from "@/models/Message";

const attachmentSchema = z.object({
  type: z.enum(["image", "document", "link"]),
  name: z.string().min(1).max(160),
  url: z.string().min(1).max(2_500_000),
});

const postSchema = z
  .object({
    body: z.string().max(8000).optional(),
    attachments: z.array(attachmentSchema).max(5).optional(),
  })
  .refine((value) => Boolean(value.body?.trim()) || Boolean(value.attachments?.length), {
    message: "Informe uma mensagem, anexo ou link.",
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
    const isParticipant =
      conv?.contractorId.toString() === session.sub || conv?.participantId?.toString() === session.sub;
    if (!conv || !isParticipant) {
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
        attachments: m.attachments ?? [],
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
    const isContractor = conv?.contractorId.toString() === session.sub;
    const isParticipant = conv?.participantId?.toString() === session.sub;
    if (!conv || (!isContractor && !isParticipant)) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    const msg = await Message.create({
      conversationId: conv._id,
      sender: isContractor ? "contractor" : "guest",
      body: parsed.data.body?.trim() ?? "",
      attachments: parsed.data.attachments ?? [],
    });
    conv.updatedAt = new Date();
    await conv.save();
    return NextResponse.json({
      message: {
        id: msg._id.toString(),
        sender: msg.sender,
        body: msg.body,
        attachments: msg.attachments ?? [],
        createdAt: msg.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao enviar" }, { status: 500 });
  }
}
