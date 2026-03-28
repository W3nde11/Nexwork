import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/Job";
import { Conversation } from "@/models/Conversation";
import { Message } from "@/models/Message";

const firstSchema = z.object({
  jobId: z.string(),
  guestSessionId: z.string().min(8),
  guestName: z.string().min(2),
  body: z.string().min(1).max(8000),
});

const nextSchema = z.object({
  conversationId: z.string(),
  guestSessionId: z.string().min(8),
  body: z.string().min(1).max(8000),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    await connectDB();

    if (json.conversationId) {
      const parsed = nextSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
      }
      const { conversationId, guestSessionId, body } = parsed.data;
      if (!mongoose.isValidObjectId(conversationId)) {
        return NextResponse.json({ error: "Inválido" }, { status: 400 });
      }
      const conv = await Conversation.findById(conversationId);
      if (!conv || conv.guestSessionId !== guestSessionId) {
        return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
      }
      const msg = await Message.create({
        conversationId: conv._id,
        sender: "guest",
        body,
      });
      conv.updatedAt = new Date();
      await conv.save();
      return NextResponse.json({
        conversationId: conv._id.toString(),
        message: {
          id: msg._id.toString(),
          sender: "guest" as const,
          body: msg.body,
          createdAt: msg.createdAt,
        },
      });
    }

    const parsed = firstSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Informe nome e mensagem válidos" },
        { status: 400 }
      );
    }
    const { jobId, guestSessionId, guestName, body } = parsed.data;
    if (!mongoose.isValidObjectId(jobId)) {
      return NextResponse.json({ error: "Vaga inválida" }, { status: 400 });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Vaga não encontrada" }, { status: 404 });
    }

    let conv = await Conversation.findOne({ jobId: job._id, guestSessionId });
    if (!conv) {
      conv = await Conversation.create({
        jobId: job._id,
        contractorId: job.contractorId,
        guestSessionId,
        guestName,
      });
    } else if (conv.guestName !== guestName) {
      conv.guestName = guestName;
      await conv.save();
    }

    const msg = await Message.create({
      conversationId: conv._id,
      sender: "guest",
      body,
    });
    conv.updatedAt = new Date();
    await conv.save();

    return NextResponse.json({
      conversationId: conv._id.toString(),
      message: {
        id: msg._id.toString(),
        sender: "guest" as const,
        body: msg.body,
        createdAt: msg.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem" },
      { status: 500 }
    );
  }
}
