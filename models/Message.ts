import mongoose, { Schema, models, model } from "mongoose";

export type SenderRole = "contractor" | "guest";

export interface IMessage {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  sender: SenderRole;
  body: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: { type: String, enum: ["contractor", "guest"], required: true },
    body: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = models.Message ?? model<IMessage>("Message", MessageSchema);
