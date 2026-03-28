import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Conversation } from "@/models/Conversation";
import type { IMessage } from "@/models/Message";
import { Message } from "@/models/Message";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  const guestSessionId = searchParams.get("guestSessionId");
  if (
    !conversationId ||
    !guestSessionId ||
    !mongoose.isValidObjectId(conversationId)
  ) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }
  try {
    await connectDB();
    const conv = await Conversation.findById(conversationId);
    if (!conv || conv.guestSessionId !== guestSessionId) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    const messages = await Message.find({ conversationId: conv._id })
      .sort({ createdAt: 1 })
      .lean<IMessage[]>();
    return NextResponse.json({
      conversationId: conv._id.toString(),
      guestName: conv.guestName,
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
