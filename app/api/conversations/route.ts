import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { IConversation } from "@/models/Conversation";
import { Conversation } from "@/models/Conversation";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    await connectDB();
    const list = await Conversation.find({ contractorId: session.sub })
      .sort({ updatedAt: -1 })
      .populate("jobId", "title")
      .lean<
        (IConversation & {
          jobId?: { _id: unknown; title?: string } | null;
        })[]
      >();
    return NextResponse.json({
      conversations: list.map((c) => ({
        id: String(c._id),
        guestName: c.guestName,
        updatedAt: c.updatedAt,
        job: c.jobId
          ? {
              id: String(c.jobId._id),
              title: c.jobId.title ?? "",
            }
          : null,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao listar conversas" },
      { status: 500 }
    );
  }
}
