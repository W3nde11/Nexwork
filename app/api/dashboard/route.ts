import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Job } from "@/models/Job";
import { Conversation } from "@/models/Conversation";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    await connectDB();
    const [jobCount, conversationCount] = await Promise.all([
      Job.countDocuments({ contractorId: session.sub }),
      Conversation.countDocuments({ contractorId: session.sub }),
    ]);
    return NextResponse.json({ jobCount, conversationCount });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao carregar resumo", jobCount: 0, conversationCount: 0 },
      { status: 500 }
    );
  }
}
