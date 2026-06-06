import mongoose, { Schema, models, model } from "mongoose";

export type NotificationFrequency = "per_event" | "daily" | "scheduled";

export interface INotificationChannels {
  app: boolean;
  email: boolean;
  whatsapp: boolean;
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash?: string | null;
  googleId?: string | null;
  name: string;
  company?: string;
  professionalTitle?: string;
  bio?: string;
  professionalExperience?: string;
  interestAreas?: string[];
  skills?: string[];
  location?: string;
  portfolio?: string;
  birthDate?: Date;
  /** Telefone para contato / WhatsApp (notificações). */
  phone?: string;
  /** Data URL da imagem ou URL https pública. */
  avatar?: string | null;
  notificationChannels?: INotificationChannels;
  notificationFrequency?: NotificationFrequency;
  /** Horário para resumo programado (HH:mm), quando frequency === "scheduled". */
  notificationScheduledTime?: string | null;
  createdAt: Date;
}

const NotificationChannelsSchema = new Schema<INotificationChannels>(
  {
    app: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, default: null },
    googleId: { type: String, sparse: true, unique: true },
    name: { type: String, required: true },
    company: { type: String },
    professionalTitle: { type: String, default: "" },
    bio: { type: String, default: "" },
    professionalExperience: { type: String, default: "" },
    interestAreas: [{ type: String }],
    skills: [{ type: String }],
    location: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    birthDate: { type: Date },
    phone: { type: String, default: "" },
    avatar: { type: String, default: null },
    notificationChannels: {
      type: NotificationChannelsSchema,
      default: () => ({ app: true, email: true, whatsapp: false }),
    },
    notificationFrequency: {
      type: String,
      enum: ["per_event", "daily", "scheduled"],
      default: "per_event",
    },
    notificationScheduledTime: { type: String, default: null },
  },
  { timestamps: true }
);

export const User = models.User ?? model<IUser>("User", UserSchema);
