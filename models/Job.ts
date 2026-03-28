import mongoose, { Schema, models, model } from "mongoose";

export interface IJob {
  _id: mongoose.Types.ObjectId;
  contractorId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budget?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    contractorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

JobSchema.index({ contractorId: 1, createdAt: -1 });

export const Job = models.Job ?? model<IJob>("Job", JobSchema);
