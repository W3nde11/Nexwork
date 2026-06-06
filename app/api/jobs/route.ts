import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { IJob } from "@/models/Job";
import { Job } from "@/models/Job";

type JobListLean = Omit<IJob, "contractorId"> & {
  contractorId: { _id: unknown; name: string; company?: string } | null;
};
import { User } from "@/models/User";

const createSchema = z.object({
  category: z.string().min(1).optional(),
  title: z.string().min(3),
  description: z.string().min(10),
  budget: z.string().optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
  experienceLevel: z.enum(["iniciante", "intermediario", "especialista"]).optional(),
  proposalDays: z.number().int().min(1).max(90).optional(),
  visibility: z.enum(["publico", "privado"]).optional(),
});

export async function GET() {
  try {
    await connectDB();
    const session = await getSession();
    const visibilityFilter = session
      ? {
          $or: [
            { visibility: { $ne: "privado" } },
            { contractorId: session.sub },
          ],
        }
      : { visibility: { $ne: "privado" } };
    const jobs = await Job.find(visibilityFilter)
      .sort({ createdAt: -1 })
      .populate("contractorId", "name company")
      .lean<JobListLean[]>();
    return NextResponse.json({
      jobs: jobs.map((j) => ({
        id: String(j._id),
        contractorId: j.contractorId ? String(j.contractorId._id) : "",
        category: j.category,
        title: j.title,
        description: j.description,
        budget: j.budget,
        tags: j.tags ?? [],
        attachments: j.attachments ?? [],
        experienceLevel: j.experienceLevel,
        proposalDays: j.proposalDays,
        visibility: j.visibility,
        createdAt: j.createdAt,
        contractor: j.contractorId
          ? {
              name: j.contractorId.name,
              company: j.contractorId.company,
            }
          : null,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível carregar as vagas." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const json = await req.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    await connectDB();
    const user = await User.findById(session.sub);
    if (!user) {
      return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
    }
    const job = await Job.create({
      contractorId: user._id,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description,
      budget: parsed.data.budget,
      tags: parsed.data.tags ?? [],
      attachments: parsed.data.attachments ?? [],
      experienceLevel: parsed.data.experienceLevel ?? "intermediario",
      proposalDays: parsed.data.proposalDays ?? 30,
      visibility: parsed.data.visibility ?? "publico",
    });
    return NextResponse.json({
      job: {
        id: job._id.toString(),
        category: job.category,
        title: job.title,
        description: job.description,
        budget: job.budget,
        tags: job.tags,
        attachments: job.attachments,
        experienceLevel: job.experienceLevel,
        proposalDays: job.proposalDays,
        visibility: job.visibility,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao publicar vaga." },
      { status: 500 }
    );
  }
}
