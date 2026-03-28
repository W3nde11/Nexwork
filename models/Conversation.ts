import mongoose, { Schema, models, model } from "mongoose";

export interface IConversation {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  contractorId: mongoose.Types.ObjectId;
  guestSessionId: string;
  guestName: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    contractorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    guestSessionId: { type: String, required: true },
    guestName: { type: String, required: true },
  },
  { timestamps: true }
);

ConversationSchema.index({ jobId: 1, guestSessionId: 1 }, { unique: true });
ConversationSchema.index({ contractorId: 1, updatedAt: -1 });

export const Conversation =
  models.Conversation ?? model<IConversation>("Conversation", ConversationSchema);
