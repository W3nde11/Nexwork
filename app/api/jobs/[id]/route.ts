import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { IJob } from "@/models/Job";
import { Job } from "@/models/Job";

type JobLean = Omit<IJob, "contractorId"> & {
  contractorId: { name: string; company?: string };
};

const patchSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  budget: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  try {
    await connectDB();
    const job = await Job.findById(id)
      .populate("contractorId", "name company")
      .lean<JobLean | null>();
    if (!job) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    const c = job.contractorId;
    return NextResponse.json({
      job: {
        id: job._id.toString(),
        title: job.title,
        description: job.description,
        budget: job.budget,
        tags: job.tags ?? [],
        createdAt: job.createdAt,
        contractor: { name: c.name, company: c.company },
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao carregar" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  const json = await req.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
  try {
    await connectDB();
    const job = await Job.findById(id);
    if (!job || job.contractorId.toString() !== session.sub) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    const d = parsed.data;
    if (d.title !== undefined) job.title = d.title;
    if (d.description !== undefined) job.description = d.description;
    if (d.budget !== undefined) job.budget = d.budget ?? undefined;
    if (d.tags !== undefined) job.tags = d.tags;
    await job.save();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
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
    const job = await Job.findById(id);
    if (!job || job.contractorId.toString() !== session.sub) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }
    await job.deleteOne();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}
