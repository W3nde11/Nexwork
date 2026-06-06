import mongoose, { Schema, models, model } from "mongoose";

export type SenderRole = "contractor" | "guest";
export type MessageAttachmentType = "image" | "document" | "link";

export interface IMessageAttachment {
  type: MessageAttachmentType;
  name: string;
  url: string;
}

export interface IMessage {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  sender: SenderRole;
  body: string;
  attachments?: IMessageAttachment[];
  createdAt: Date;
}

const MessageAttachmentSchema = new Schema<IMessageAttachment>(
  {
    type: { type: String, enum: ["image", "document", "link"], required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: { type: String, enum: ["contractor", "guest"], required: true },
    body: { type: String, default: "" },
    attachments: { type: [MessageAttachmentSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = models.Message ?? model<IMessage>("Message", MessageSchema);
