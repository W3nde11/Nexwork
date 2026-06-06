import mongoose, { Schema, models, model } from "mongoose";

export interface IJob {
  _id: mongoose.Types.ObjectId;
  contractorId: mongoose.Types.ObjectId;
  category?: string;
  title: string;
  description: string;
  budget?: string;
  tags: string[];
  attachments?: string[];
  experienceLevel?: "iniciante" | "intermediario" | "especialista";
  proposalDays?: number;
  visibility?: "publico" | "privado";
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    contractorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String },
    tags: [{ type: String }],
    attachments: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: ["iniciante", "intermediario", "especialista"],
      default: "intermediario",
    },
    proposalDays: { type: Number, default: 30 },
    visibility: {
      type: String,
      enum: ["publico", "privado"],
      default: "publico",
    },
  },
  { timestamps: true }
);

JobSchema.index({ contractorId: 1, createdAt: -1 });

export const Job = models.Job ?? model<IJob>("Job", JobSchema);
