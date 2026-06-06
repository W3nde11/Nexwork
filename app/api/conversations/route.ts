import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { IConversation } from "@/models/Conversation";
import { Conversation } from "@/models/Conversation";
import { Job } from "@/models/Job";
import { User } from "@/models/User";

const createSchema = z.object({
  jobId: z.string().min(1),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    await connectDB();
    const list = await Conversation.find({
      $or: [{ contractorId: session.sub }, { participantId: session.sub }],
    })
      .sort({ updatedAt: -1 })
      .populate("jobId", "title")
      .populate("contractorId", "name company")
      .populate(
        "participantId",
        "name company professionalTitle bio professionalExperience interestAreas skills location portfolio avatar"
      )
      .lean<
        (IConversation & {
          jobId?: { _id: unknown; title?: string } | null;
          contractorId?: { _id: unknown; name?: string; company?: string } | null;
          participantId?: {
            _id: unknown;
            name?: string;
            company?: string;
            professionalTitle?: string;
            bio?: string;
            professionalExperience?: string;
            interestAreas?: string[];
            skills?: string[];
            location?: string;
            portfolio?: string;
            avatar?: string | null;
          } | null;
        })[]
      >();
    return NextResponse.json({
      conversations: list.map((c) => {
        const currentUserRole =
          c.contractorId && String(c.contractorId._id) === session.sub ? "contractor" : "guest";
        const otherName =
          currentUserRole === "contractor"
            ? c.participantId?.name ?? c.guestName
            : c.contractorId?.company ?? c.contractorId?.name ?? "Contratante NexWork";

        return {
          id: String(c._id),
          guestName: c.guestName,
          otherName,
          currentUserRole,
          participantProfile:
            currentUserRole === "contractor" && c.participantId
              ? {
                  name: c.participantId.name ?? c.guestName,
                  company: c.participantId.company ?? "",
                  professionalTitle: c.participantId.professionalTitle ?? "",
                  bio: c.participantId.bio ?? "",
                  professionalExperience: c.participantId.professionalExperience ?? "",
                  interestAreas: c.participantId.interestAreas ?? [],
                  skills: c.participantId.skills ?? [],
                  location: c.participantId.location ?? "",
                  portfolio: c.participantId.portfolio ?? "",
                  avatar: c.participantId.avatar ?? null,
                }
              : null,
          updatedAt: c.updatedAt,
          job: c.jobId
            ? {
                id: String(c.jobId._id),
                title: c.jobId.title ?? "",
              }
            : null,
        };
      }),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao listar conversas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  try {
    await connectDB();
    const [job, user] = await Promise.all([
      Job.findById(parsed.data.jobId),
      User.findById(session.sub),
    ]);

    if (!job || !user) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    if (job.contractorId.toString() === session.sub) {
      return NextResponse.json(
        { error: "Você não pode iniciar conversa com sua própria publicação." },
        { status: 400 }
      );
    }

    const guestSessionId = `user:${session.sub}`;
    const conversation = await Conversation.findOneAndUpdate(
      { jobId: job._id, guestSessionId },
      {
        $setOnInsert: {
          jobId: job._id,
          contractorId: job.contractorId,
          participantId: user._id,
          guestSessionId,
          guestName: user.name,
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ conversationId: conversation._id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao criar conversa" }, { status: 500 });
  }
}
