import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  /** Ausente ou null para contas apenas Google. */
  passwordHash?: string | null;
  /** OpenID `sub` do Google; único quando definido. */
  googleId?: string | null;
  name: string;
  company?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, default: null },
    googleId: { type: String, sparse: true, unique: true },
    name: { type: String, required: true },
    company: { type: String },
  },
  { timestamps: true }
);

export const User = models.User ?? model<IUser>("User", UserSchema);
